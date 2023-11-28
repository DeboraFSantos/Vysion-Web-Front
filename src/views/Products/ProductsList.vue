<template>
    <div class="container-all" id="product-list">
        <h2 class="mt-3">
            Produtos
        </h2>

        <Search 
            class="mb-4 mt-4"
            :show-clear="true"
            @clear-filter="clearFilter"
        >
            <div class="row">
                <div class="col-12 col-md-6">
                    <InputComponent 
                        label-name="Nome"
                        :isRequired="false"
                    >
                        <input 
                            v-model="nameFilter"
                            @input="searchFilter('name', nameFilter)"
                        />
                    </InputComponent>
                </div>
                <div class="col-12 col-md-6">
                    <InputComponent 
                        label-name="SKU"
                        :isRequired="false"
                    >
                        <input 
                            v-model="skuFilter"
                            @input="searchFilter('sku', skuFilter)"
                        />
                    </InputComponent>
                </div>
            </div>
        </Search>

        <div class="d-flex justify-content-end align-items-center mt-2">
            <div>
                <router-link to="product/add">
                    <button class="primary">Criar produto</button>
                </router-link>
                <button class="green ml-2" @click="exportFile">
                    <font-awesome-icon icon="spinner" class="icon-loading" v-if="isExportLoading"/> 
                    Exportar relatório
                </button>
            </div>
        </div>

        <div class="d-flex align-items-center justify-content-center mt-5 mb-5" v-if="isLoading">
            <Loading />
        </div>

        <div v-else>
            <div v-if="products.length > 0">
                <table class="main-table mt-4">
                    <tbody>
                        <tr>
                            <th>Nome</th>
                            <th>Preço</th>
                            <th>SKU</th>
                            <th>Categoria</th>
                            <th>Data de criação</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                        <tr v-for="(product, index) in products" :key="index">
                            <td data-th="Nome">
                                {{product.name}}
                            </td>
                            <td data-th="Preço">
                                {{helpers.centsToReal(product.price)}}
                            </td>
                            <td data-th="SKU">
                                {{product.sku}}
                            </td>
                            <td data-th="Categoria">
                                {{product.category?.name ?? '-'}}
                            </td>
                            <td data-th="Data de criação">
                                {{helpers.formatDate(product.createdDate)}}
                            </td>
                            <td data-th="Status">
                                {{product.isActive ? 'Ativo' : 'Inativo'}}
                            </td>
                            <td data-th="Ações">
                                <div class="d-flex">
                                    <div @click="goToRoute('edit-product', product.id)" v-if="currentRole === 'admin' || currentRole === 'seller'">
                                        <font-awesome-icon icon="edit" class="action-icon c-pointer"/> 
                                    </div>

                                    <div @click="goToRoute('product-details', product.id)">
                                        <font-awesome-icon icon="chevron-right" class="action-icon c-pointer"/> 
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <Pagination 
                    :totalItems="total" 
                    :perPage="parameters.pageSize" 
                    :current-page="parameters.currentPage"
                    @change-per-page="changePerPage" 
                    @next-page="nextPage"
                    @previous-page="previousPage"
                    @go-to-page="goToPage"
                />
            </div>

            <div class="box-area mt-4" v-else>
                <p>Ainda não há produtos cadastrados</p>
            </div>

        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import Pagination from '@/components/Pagination.vue'
import Search from '@/components/Search.vue'
import { useProductStore } from '@/stores/products.js'
import { helpers } from '@/utils/helpers'
import router from '@/router';
import Loading from '@/components/Loading.vue'
import axios from 'axios';
import InputComponent from '@/components/form/Input.vue'
// @ts-ignore
import debounce from 'lodash.debounce'

const productStore = useProductStore();
const products = ref();
const total = ref(0);
const isLoading = ref(false);

const nameFilter = ref();
const skuFilter = ref();
const currentRole = ref(helpers.getCurrentRole());

const parameters = reactive({
    currentPage:1,
    pageSize:10
})

const getProducts = (params: any) => {
    isLoading.value = true;

    productStore.getProducts(params)
    .then((response) => {
        products.value = response.products;
        total.value = response.total;

        isLoading.value = false;
    })
    .catch((error) => {
        console.log(error);
        isLoading.value = false;
    })
}

getProducts(parameters);

const changePerPage = (perPage:any) => {
    parameters.currentPage = 1;
    parameters.pageSize = perPage;
    getProducts(parameters);
}

const nextPage = (page:any) => {
    parameters.currentPage = page;
    getProducts(parameters);
}

const previousPage = (page:any) => {
    parameters.currentPage = page;
    getProducts(parameters);
}

const goToPage = (page:any) => {
    parameters.currentPage = page;
    getProducts(parameters);
}

const goToRoute = (name: string, id: string) => {
    router.push({name: name, params: { id: id }})
}

const isExportLoading = ref(false);

const exportFile = async () => {
    isExportLoading.value = true;

    try {
        const token = localStorage.getItem('token');

        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // @ts-ignore
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/products/export`, {
        headers: headers,
        responseType: 'blob' 
        });

        if (response.status === 200) {
            const blob = new Blob([response.data], { type: 'text/csv' }); 
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'products.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            isExportLoading.value = false;
        } else {
            isExportLoading.value = false;
        }
    } catch (error) {
        isExportLoading.value = false;
    }
};

const searchFilter = debounce((name:string, value:any) => {
    // @ts-ignore
    parameters[name] = value;
    getProducts(parameters);
}, 500)

const clearFilter = () => {
    nameFilter.value = null;
    skuFilter.value = null;

    // @ts-ignore
    delete parameters.name;
    // @ts-ignore
    delete parameters.sku;

    getProducts(parameters)
}
</script>

<style lang="scss" scoped>
.action-icon {
    font-size: 12px;
    color:$primary-color;
    margin:0px 8px;;
}

p {
    margin-bottom:0px;
}
</style>