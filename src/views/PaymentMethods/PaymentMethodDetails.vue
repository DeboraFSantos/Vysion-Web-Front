<template>
    <div class="container-all" id="edit-paymentMethod">
        <div class="mb-4 d-flex align-items-center">
            <router-link to="/paymentMethods">
                <font-awesome-icon icon="chevron-left" class="back-icon"/> 
            </router-link>
            <h2>
                Detalhes do paymentMethode
            </h2>
        </div>

        <div class="d-flex align-items-center justify-content-center mt-5 mb-5" v-if="isLoading">
            <Loading />
        </div>


        <div class="box-area" v-else>
            <div class="d-flex mb-1">
                <b>ID</b>:
                <p class="ml-1">{{paymentMethodData?.id}}</p>
            </div>
            <div class="d-flex mb-1">
                <b>Nome</b>:
                <p class="ml-1">{{paymentMethodData?.name}}</p>
            </div>

            <div class="d-flex justify-content-end mt-2"  v-if="currentRole === 'admin'">
                <button
                    class="danger"
                    data-toggle="modal" 
                    data-target="#allModal"
                >
                    <font-awesome-icon icon="trash" class="action-icon c-pointer"/> 
                    Deletar Meio de Pagamento
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
                Tem certeza que deseja excluir esse meio de pagamento?
            </div>
            <div class="modal-footer">
                <button type="button" class="default" data-dismiss="modal">Fechar</button>
                <button type="button" class="danger" @click="deletePaymentMethod(paymentMethodData.id)">Deletar meio de pagamento</button>
            </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { usePaymentMethodStore } from '@/stores/paymentMethods.js'
import Loading from '@/components/Loading.vue'
import router from '@/router';
import { helpers } from '@/utils/helpers'

const isLoading = ref(false);

const route = useRoute();

const paymentMethodId = route.params.id.toString();
const paymentMethodData = ref();
const paymentMethodStore = usePaymentMethodStore();
const currentRole = ref(helpers.getCurrentRole());

const getPaymentMethodById = () => {
    isLoading.value = true;

    paymentMethodStore.getPaymentMethodById(paymentMethodId)
    .then((response) => {
        paymentMethodData.value = response;
        isLoading.value = false;
    })
    .catch((error) => {
        console.log(error);
        isLoading.value = false;
    })
}

getPaymentMethodById();

const deletePaymentMethod = (id:string) => {
    isLoading.value = true;
    paymentMethodStore.deletePaymentMethod(id)
    .then((response) => {
        router.push('/paymentMethods');
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