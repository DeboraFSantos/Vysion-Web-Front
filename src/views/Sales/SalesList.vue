<template>
    <div class="container-all" id="sale-list">
        <h2 class="mt-3">
            Vendas
        </h2>

        <Search 
            class="mb-4 mt-4"
            :show-clear="true"
            @clear-filter="clearFilter"
        >
            <div class="row">
                <div class="col-12 col-md-4">
                    <InputComponent 
                        label-name="Nome do cliente"
                        :isRequired="false"
                    >
                        <input 
                            v-model="clientNameFilter"
                            @input="searchFilter('clientName', clientNameFilter)"
                        />
                    </InputComponent>
                </div>
                <div class="col-12 col-md-4">
                    <InputComponent 
                        label-name="Nome do vendedor"
                        :isRequired="false"
                    >
                        <input 
                            v-model="sellerNameFilter"
                            @input="searchFilter('sellerName', sellerNameFilter)"
                        />
                    </InputComponent>
                </div>
                <div class="col-12 col-md-4">
                    <InputComponent 
                        label-name="Método de pagamento"
                        :isRequired="false"
                    >
                        <input 
                            v-model="paymentMethodFilter"
                            @input="searchFilter('paymentMethod', paymentMethodFilter)"
                        />
                    </InputComponent>
                </div>
            </div>
        </Search>

        <div class="d-flex justify-content-end align-items-center mt-2" v-if="currentRole === 'admin' || currentRole === 'seller'">
            <div>
                <router-link to="sale/add">
                    <button class="primary">Criar venda</button>
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
            <div v-if="sales.length > 0">
                <table class="main-table mt-4">
                    <tbody>
                        <tr>
                            <th>Nome do cliente</th>
                            <th>Nome do vendedor</th>
                            <th>Valor total da venda</th>
                            <th>Data de criação</th>
                            <th>Método de pagamento</th>
                            <th>Ações</th>
                        </tr>
                        <tr v-for="(sale, index) in sales" :key="index">
                            <td data-th="Nome do cliente">
                                {{ sale?.clientInfo?.name }}
                            </td>
                            <td data-th="Nome do vendedor">
                                {{sale?.sellerInfo?.name}}
                            </td>
                            <td data-th="Valor total da venda">
                                {{helpers.centsToReal(sale.totalSale)}}
                            </td>
                            <td data-th="Data de criação">
                                {{helpers.formatDate(sale?.createdDate)}}
                            </td>
                            <td data-th="Método de pagamento">
                                {{sale?.paymentMethod}}
                            </td>
                            <td data-th="Ações">
                                <div class="d-flex">
                                    <div @click="goToRoute('edit-sale', sale.id)" v-if="currentRole === 'admin' || currentRole === 'seller'">
                                        <font-awesome-icon icon="edit" class="action-icon c-pointer"/> 
                                    </div>

                                    <div @click="goToRoute('sale-details', sale.id)">
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
import { useSaleStore } from '@/stores/sales.js'
import { helpers } from '@/utils/helpers'
import router from '@/router';
import Loading from '@/components/Loading.vue'
import axios from 'axios';
// @ts-ignore
import debounce from 'lodash.debounce'
import InputComponent from '@/components/form/Input.vue'

const saleStore = useSaleStore();
const sales = ref();
const total = ref(0);
const isLoading = ref(false);
const clientNameFilter = ref();
const sellerNameFilter = ref();
const paymentMethodFilter = ref();

const parameters = reactive({
    currentPage:1,
    pageSize:10
})

const currentRole = ref(helpers.getCurrentRole());

const getSales = (params: any) => {
    isLoading.value = true;

    saleStore.getSales(params)
    .then((response) => {
        sales.value = response.sales;
        total.value = response.total;

        isLoading.value = false;
    })
    .catch((error) => {
        console.log(error);
        isLoading.value = false;
    })
}

getSales(parameters);

const changePerPage = (perPage:any) => {
    parameters.currentPage = 1;
    parameters.pageSize = perPage;
    getSales(parameters);
}

const nextPage = (page:any) => {
    parameters.currentPage = page;
    getSales(parameters);
}

const previousPage = (page:any) => {
    parameters.currentPage = page;
    getSales(parameters);
}

const goToPage = (page:any) => {
    parameters.currentPage = page;
    getSales(parameters);
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

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/sales/export`, {
        headers: headers,
        responseType: 'blob' 
        });

        if (response.status === 200) {
            const blob = new Blob([response.data], { type: 'text/csv' }); 
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'sales.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            isExportLoading.value = false;
        } else {
            console.error('Erro ao exportar vendas:', response.statusText);
            isExportLoading.value = false;
        }
    } catch (error) {
        console.error('Erro ao exportar vendas:', error);
        isExportLoading.value = false;
    }
};

const searchFilter = debounce((name:string, value:any) => {
    // @ts-ignore
    parameters[name] = value;
    getSales(parameters);
}, 500)


const clearFilter = () => {
    clientNameFilter.value = null;
    sellerNameFilter.value = null;
    paymentMethodFilter.value = null;

    // @ts-ignore
    delete parameters.clientName;
    // @ts-ignore
    delete parameters.sellerName;
    // @ts-ignore
    delete parameters.paymentMethod;

    getSales(parameters)
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