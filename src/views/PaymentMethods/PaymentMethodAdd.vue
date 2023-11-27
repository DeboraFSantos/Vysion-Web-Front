<template>
    <div class="container-all" id="add-paymentMethods">
        <div class="mb-4 d-flex align-items-center">
            <router-link to="/paymentMethods">
                <font-awesome-icon icon="chevron-left" class="back-icon"/> 
            </router-link>
            <h2>
                Criar meio de pagamento
            </h2>
        </div>

        <div class="box-area">
            <div class="row">
                <div class="col-12">
                    <InputComponent 
                        label-name="Nome"
                        :isRequired="true"
                        :isValid="v$.name.$error"
                        error-message="Campo obrigatório"
                    >
                        <input 
                            :class="{'error-input': v$.name.$error}"
                            v-model="body.name"
                        />
                    </InputComponent>
                </div>
            </div>
        </div>

        <div class="d-flex justify-content-end mt-4">
            <router-link to="paymentMethods">
                <button class="default mr-2">Cancelar</button>
            </router-link>
            <button class="primary" @click="createPaymentMethod">
                <font-awesome-icon icon="spinner" class="icon-login" v-if="isLoading"/> 
                Salvar
            </button>

        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from 'vue';
import InputComponent from '@/components/form/Input.vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import { usePaymentMethodStore } from '@/stores/paymentMethods.js'
import iziToast from 'izitoast';
import router from '@/router';
import { vMaska } from "maska"

const isLoading = ref(false);

const paymentMethodsStore = usePaymentMethodStore();

const body = reactive({
    name: ""
})

const validate = computed(() => {
    return {
        name: { required }
    }
});

const v$ = useVuelidate(validate, body);

const createPaymentMethod = async () => {
    isLoading.value = true;

    const result = await v$.value.$validate();

    if(result){
        paymentMethodsStore.createPaymentMethod(body)
        .then((response) => {
            isLoading.value = false;

            iziToast.success({
                title: 'PaymentMethode criado com sucesso',
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
                message: 'Erro ao criar meio de pagamento',
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