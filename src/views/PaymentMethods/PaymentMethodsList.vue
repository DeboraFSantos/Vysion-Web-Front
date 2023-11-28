<template>
    <div class="container-all" id="paymentMethods-list">
        <div class="d-flex justify-content-between align-items-center mt-2 flex-wrap">
            <h2>
                Meios de pagamento
            </h2>

            <div>
                <router-link to="paymentMethod/add">
                    <button class="primary">Criar meio de pagamento</button>
                </router-link>
            </div>
        </div>

        <div class="d-flex align-items-center justify-content-center mt-5 mb-5" v-if="isLoading">
            <Loading />
        </div>

        <div v-else>
            <div v-if="paymentMethods.length > 0">
                <table class="main-table mt-4">
                    <tbody>
                        <tr>
                            <th>Nome</th>
                            <th>Data de criação</th>
                            <th>Ações</th>
                        </tr>
                        <tr v-for="(paymentMethod, index) in paymentMethods" :key="index">
                            <td data-th="Nome">
                                {{paymentMethod.name}}
                            </td>
                            <td data-th="Data de criação">
                                {{helpers.formatDate(paymentMethod.createdDate)}}
                            </td>
                            <td data-th="Ações">
                                <div class="d-flex">
                                    <div @click="goToRoute('edit-paymentMethod', paymentMethod.id)" v-if="currentRole === 'admin' || currentRole === 'seller'">
                                        <font-awesome-icon icon="edit" class="action-icon c-pointer"/> 
                                    </div>

                                    <div @click="goToRoute('paymentMethod-details', paymentMethod.id)">
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
import { usePaymentMethodStore } from '@/stores/paymentMethods.js'
import { helpers } from '@/utils/helpers'
import router from '@/router';
import Loading from '@/components/Loading.vue'
import axios from 'axios';

const paymentMethodStore = usePaymentMethodStore();
const paymentMethods = ref();
const total = ref(0);
const isLoading = ref(false);
const currentRole = ref(helpers.getCurrentRole());

const parameters = reactive({
    currentPage:1,
    pageSize:10
})

const getPaymentMethods = (params: any) => {
    isLoading.value = true;

    paymentMethodStore.getPaymentMethods(params)
    .then((response) => {
        paymentMethods.value = response.paymentMethods;
        total.value = response.total;

        isLoading.value = false;
    })
    .catch((error) => {
        console.log(error);
        isLoading.value = false;
    })
}

getPaymentMethods(parameters);

const changePerPage = (perPage:any) => {
    parameters.currentPage = 1;
    parameters.pageSize = perPage;
    getPaymentMethods(parameters);
}

const nextPage = (page:any) => {
    parameters.currentPage = page;
    getPaymentMethods(parameters);
}

const previousPage = (page:any) => {
    parameters.currentPage = page;
    getPaymentMethods(parameters);
}

const goToPage = (page:any) => {
    parameters.currentPage = page;
    getPaymentMethods(parameters);
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
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/paymentMethods/export`, {
        headers: headers,
        responseType: 'blob' 
        });

        if (response.status === 200) {
            const blob = new Blob([response.data], { type: 'text/csv' }); 
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'paymentMethods.csv');
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