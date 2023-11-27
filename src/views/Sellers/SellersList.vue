<template>
    <div class="container-all" id="sellers-list">
        <div class="d-flex justify-content-between align-items-center mt-2">
            <h2>
                Usuários
            </h2>
        </div>

        <div class="d-flex align-items-center justify-content-center mt-5 mb-5" v-if="isLoading">
            <Loading />
        </div>

        <div v-else>
            <div v-if="sellers.length > 0">
                <table class="main-table mt-4">
                    <tbody>
                        <tr>
                            <th>Nome</th>
                            <th>E-mail</th>
                            <th>Documento</th>
                            <th>Telefone</th>
                            <th>Permissão</th>
                            <th>Data de criação</th>
                            <th>Ações</th>
                        </tr>
                        <tr v-for="(seller, index) in sellers" :key="index">
                            <td data-th="Nome">
                                {{seller.name}}
                            </td>
                            <td data-th="E-mail">
                                {{seller.email}}
                            </td>
                            <td data-th="Documento">
                                {{seller.cpf}}
                            </td>
                            <td data-th="Telefone">
                                {{seller.phone}}
                            </td>
                            <td data-th="Permissão">
                                {{translateName(seller.role)}}
                            </td>
                            <td data-th="Data de criação">
                                {{helpers.formatDate(seller.createdDate)}}
                            </td>
                            <td data-th="Ações">
                                <div class="d-flex">
                                    <div @click="goToRoute('edit-seller', seller.id)" v-if="currentRole === 'admin' || currentRole === 'seller'" >
                                        <font-awesome-icon icon="edit" class="action-icon c-pointer"/> 
                                    </div>

                                    <div @click="goToRoute('seller-details', seller.id)">
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
import { useSellerStore } from '@/stores/sellers.js'
import { helpers } from '@/utils/helpers'
import router from '@/router';
import Loading from '@/components/Loading.vue'

const sellerStore = useSellerStore();
const sellers = ref();
const total = ref(0);
const isLoading = ref(false);
const currentRole = ref(helpers.getCurrentRole());

const parameters = reactive({
    currentPage:1,
    pageSize:10
})

const getSellers = (params: any) => {
    isLoading.value = true;

    sellerStore.getSellers(params)
    .then((response) => {
        sellers.value = response.users;
        total.value = response.total;

        isLoading.value = false;
    })
    .catch((error) => {
        console.log(error);
        isLoading.value = false;
    })
}

getSellers(parameters);

const changePerPage = (perPage:any) => {
    parameters.currentPage = 1;
    parameters.pageSize = perPage;
    getSellers(parameters);
}

const nextPage = (page:any) => {
    parameters.currentPage = page;
    getSellers(parameters);
}

const previousPage = (page:any) => {
    parameters.currentPage = page;
    getSellers(parameters);
}

const goToPage = (page:any) => {
    parameters.currentPage = page;
    getSellers(parameters);
}

const goToRoute = (name: string, id: string) => {
    router.push({name: name, params: { id: id }})
}

const rolesList = [
    {
        name:'Administrador',
        key:'admin'
    },
    {
        name:'Vendedor',
        key:'seller'
    },
    {
        name:'Usuário',
        key:'user'
    }
]

function translateName(key:string) {
    const permission = rolesList.find(role => role.key === key);
    return permission?.name;
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