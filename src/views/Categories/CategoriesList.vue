<template>
    <div class="container-all" id="categories-list">
        <div class="d-flex justify-content-between align-items-center mt-2">
            <h2>
                Categorias
            </h2>
            <router-link to="category/add">
                <button class="primary">Criar categoria</button>
            </router-link>
        </div>

        <div class="d-flex align-items-center justify-content-center mt-5 mb-5" v-if="isLoading">
            <Loading />
        </div>

        <div v-else>
            <div v-if="categories.length > 0">
                <table class="main-table mt-4">
                    <tbody>
                        <tr>
                            <th>Nome</th>
                            <th>Data de criação</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                        <tr v-for="(category, index) in categories" :key="index">
                            <td data-th="Nome">
                                {{category.name}}
                            </td>
                            <td data-th="Data de criação">
                                {{helpers.formatDate(category.createdDate)}}
                            </td>
                            <td data-th="Status">
                                {{category.isActive ? 'Ativo' : 'Inativo'}}
                            </td>
                            <td data-th="Ações">
                                <div class="d-flex">
                                    <div @click="goToRoute('edit-category', category.id)" v-if="currentRole === 'admin' || currentRole === 'seller'">
                                        <font-awesome-icon icon="edit" class="action-icon c-pointer"/> 
                                    </div>

                                    <div @click="goToRoute('category-details', category.id)">
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
import { useCategoryStore } from '@/stores/categories.js'
import { helpers } from '@/utils/helpers'
import router from '@/router';
import Loading from '@/components/Loading.vue'

const categoryStore = useCategoryStore();
const categories = ref();
const total = ref(0);
const isLoading = ref(false);
const currentRole = ref(helpers.getCurrentRole());

const parameters = reactive({
    currentPage:1,
    pageSize:10
})

const getCategories = (params: any) => {
    isLoading.value = true;

    categoryStore.getCategories(params)
    .then((response) => {
        categories.value = response.categories;
        total.value = response.total;

        isLoading.value = false;
    })
    .catch((error) => {
        console.log(error);
        isLoading.value = false;
    })
}

getCategories(parameters);

const changePerPage = (perPage:any) => {
    parameters.currentPage = 1;
    parameters.pageSize = perPage;
    getCategories(parameters);
}

const nextPage = (page:any) => {
    parameters.currentPage = page;
    getCategories(parameters);
}

const previousPage = (page:any) => {
    parameters.currentPage = page;
    getCategories(parameters);
}

const goToPage = (page:any) => {
    parameters.currentPage = page;
    getCategories(parameters);
}

const goToRoute = (name: string, id: string) => {
    router.push({name: name, params: { id: id }})
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