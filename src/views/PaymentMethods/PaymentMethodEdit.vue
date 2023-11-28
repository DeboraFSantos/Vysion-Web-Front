<template>
    <div class="container-all" id="edit-paymentMethod">
        <div class="mb-4 d-flex align-items-center">
            <router-link to="/paymentMethods">
                <font-awesome-icon icon="chevron-left" class="back-icon"/> 
            </router-link>
            <h2>
                Editar meio de pagamento
            </h2>
        </div>

        <div class="box-area">
            <div class="row">
                <div class="col-12 col-md-12">
                    <InputComponent 
                        label-name="Nome"
                        :isRequired="true"
                        :isValid="v$.name.$error"
                        error-message="Campo obrigatório"
                    >
                        <input 
                            :class="{'error-input': v$.name.$error}"
                            v-model="editable.name"
                        />
                    </InputComponent>
                </div>
            </div>
        </div>

        <div class="d-flex justify-content-end mt-4">
            <button class="default mr-2">Cancelar</button>
            <button class="primary" @click="updatePaymentMethod">
                <font-awesome-icon icon="spinner" class="icon-loading" v-if="isLoading"/> 
                Salvar
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from 'vue';
import InputComponent from '@/components/form/Input.vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { usePaymentMethodStore } from '@/stores/paymentMethods.js'
import iziToast from 'izitoast';
import router from '@/router';
import { useRoute } from 'vue-router';

const route = useRoute();

const isLoading = ref(false);
const paymentMethodStore = usePaymentMethodStore();

let editable = reactive({
    name: ""
})

const validate = computed(() => {
    return {
        name: { required }
    }
});

const paymentMethodId = route.params.id.toString();

const v$ = useVuelidate(validate, editable);

const getPaymentMethodById = () => {
    paymentMethodStore.getPaymentMethodById(paymentMethodId)
    .then((response) => {
        editable.name = response.name;
    })
}

getPaymentMethodById();

const updatePaymentMethod = async () => {
    isLoading.value = true;

    const result = await v$.value.$validate();

    if(result){
        paymentMethodStore.updatePaymentMethod(paymentMethodId, JSON.stringify(editable))
        .then((response) => {
            isLoading.value = false;

            iziToast.success({
                title: 'Meio de pagamento editado com sucesso',
                position: 'bottomCenter'
            })

            setTimeout(() => {
                router.push('/paymentMethods');
            }, 300)
        })
        .catch((error) => {
            isLoading.value = false;

            iziToast.error({
                title: 'Erro:',
                message: 'Erro ao editar meio de pagamento',
                position: 'bottomCenter'
            })
        })
    } else {
        isLoading.value = false;

        iziToast.error({
            title: 'Erro:',
            message: 'Preencha os campos obrigatórios',
            position: 'bottomCenter'
        })
    }
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
</style>