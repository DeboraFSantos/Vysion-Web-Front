<template>
    <div class="container-all" id="clients-list">
        <div class="d-flex justify-content-between align-items-center mt-2 flex-wrap">
            <h2>
                Clientes
            </h2>

            <div>
                <router-link to="client/add">
                    <button class="primary">Criar cliente</button>
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
            <div v-if="clients.length > 0">
                <table class="main-table mt-4">
                    <tbody>
                        <tr>
                            <th>Nome</th>
                            <th>E-mail</th>
                            <th>Documento</th>
                            <th>Telefone</th>
                            <th>Data de criação</th>
                            <th>Ações</th>
                        </tr>
                        <tr v-for="(client, index) in clients" :key="index">
                            <td data-th="Nome">
                                {{client.name}}
                            </td>
                            <td data-th="E-mail">
                                {{client.email}}
                            </td>
                            <td data-th="Documento">
                                {{client.document}}
                            </td>
                            <td data-th="Telefone">
                                {{client.phone}}
                            </td>
                            <td data-th="Data de criação">
                                {{helpers.formatDate(client.createdDate)}}
                            </td>
                            <td data-th="Ações">
                                <div class="d-flex">
                                    <div @click="goToRoute('edit-client', client.id)" v-if="currentRole === 'admin' || currentRole === 'seller'">
                                        <font-awesome-icon icon="edit" class="action-icon c-pointer"/> 
                                    </div>

                                    <div @click="goToRoute('client-details', client.id)">
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
import { useClientStore } from '@/stores/clients.js'
import { helpers } from '@/utils/helpers'
import router from '@/router';
import Loading from '@/components/Loading.vue'
import axios from 'axios';

const clientStore = useClientStore();
const clients = ref();
const total = ref(0);
const isLoading = ref(false);
const currentRole = ref(helpers.getCurrentRole());

const parameters = reactive({
    currentPage:1,
    pageSize:10
})

const getClients = (params: any) => {
    isLoading.value = true;

    clientStore.getClients(params)
    .then((response) => {
        clients.value = response.clients;
        total.value = response.total;

        isLoading.value = false;
    })
    .catch((error) => {
        console.log(error);
        isLoading.value = false;
    })
}

getClients(parameters);

const changePerPage = (perPage:any) => {
    parameters.currentPage = 1;
    parameters.pageSize = perPage;
    getClients(parameters);
}

const nextPage = (page:any) => {
    parameters.currentPage = page;
    getClients(parameters);
}

const previousPage = (page:any) => {
    parameters.currentPage = page;
    getClients(parameters);
}

const goToPage = (page:any) => {
    parameters.currentPage = page;
    getClients(parameters);
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
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/clients/export`, {
        headers: headers,
        responseType: 'blob' 
        });

        if (response.status === 200) {
            const blob = new Blob([response.data], { type: 'text/csv' }); 
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'clients.csv');
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