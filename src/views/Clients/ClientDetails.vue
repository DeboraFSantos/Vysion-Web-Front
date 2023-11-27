<template>
    <div class="container-all" id="edit-client">
        <div class="mb-4 d-flex align-items-center">
            <router-link to="/clients">
                <font-awesome-icon icon="chevron-left" class="back-icon"/> 
            </router-link>
            <h2>
                Detalhes do cliente
            </h2>
        </div>

        <div class="d-flex align-items-center justify-content-center mt-5 mb-5" v-if="isLoading">
            <Loading />
        </div>


        <div class="box-area" v-else>
            <div class="d-flex mb-1">
                <b>ID</b>:
                <p class="ml-1">{{clientData?.id}}</p>
            </div>
            <div class="d-flex mb-1">
                <b>Nome</b>:
                <p class="ml-1">{{clientData?.name}}</p>
            </div>
            <div class="d-flex">
                <b>E-mail:</b>
                <p class="ml-1">{{clientData?.email}}</p>
            </div>
            <div class="d-flex mb-1">
                <b>Documento</b>:
                <p class="ml-1">{{clientData?.document}}</p>
            </div>
            <div class="d-flex">
                <b>Telefone:</b>
                <p class="ml-1">{{clientData?.phone}}</p>
            </div>

            <div class="d-flex justify-content-end mt-2"  v-if="currentRole === 'admin'">
                <button
                    class="danger"
                    data-toggle="modal" 
                    data-target="#allModal"
                >
                    <font-awesome-icon icon="trash" class="action-icon c-pointer"/> 
                    Deletar cliente
                </button>
            </div>
        </div>
    </div>

    <div class="modal fade" id="allModal" tabindex="-1" role="dialog" aria-labelledby="allModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="allModalLabel">Confirmação</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                Tem certeza que deseja excluir esse cliente?
            </div>
            <div class="modal-footer">
                <button type="button" class="default" data-dismiss="modal">Fechar</button>
                <button type="button" class="danger" @click="deleteClient(clientData.id)">Deletar cliente</button>
            </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useClientStore } from '@/stores/clients.js'
import Loading from '@/components/Loading.vue'
import router from '@/router';
import { helpers } from '@/utils/helpers'

const isLoading = ref(false);

const route = useRoute();

const clientId = route.params.id.toString();
const clientData = ref();
const clientStore = useClientStore();
const currentRole = ref(helpers.getCurrentRole());

const getClientById = () => {
    isLoading.value = true;

    clientStore.getClientById(clientId)
    .then((response) => {
        clientData.value = response;
        isLoading.value = false;
    })
    .catch((error) => {
        console.log(error);
        isLoading.value = false;
    })
}

getClientById();

const deleteClient = (id:string) => {
    isLoading.value = true;
    clientStore.deleteClient(id)
    .then((response) => {
        router.push('/clients');
        document.getElementById('allModal')?.classList.remove('show');
        // @ts-ignore
        document.querySelector('.modal-backdrop').remove();
        // @ts-ignore
        document.getElementById('allModal').style.display = 'none';
    })
    .catch((error) => {
        isLoading.value = false;
    })
}
</script>

<style lang="scss" scoped>
.back-icon {
    font-size: 14px;
    color:$default-color;
    margin-right: 15px;
}

h2 {
    margin-bottom:0px;
}
.isActive {
    margin-left:10px;
}

b {
    color:#222;
}

p {
    margin-top: 0;
    margin-bottom: 0rem;
}
</style>