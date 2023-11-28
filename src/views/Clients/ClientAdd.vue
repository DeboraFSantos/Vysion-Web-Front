<template>
    <div class="container-all" id="add-client">
        <div class="mb-4 d-flex align-items-center">
            <router-link to="/clients">
                <font-awesome-icon icon="chevron-left" class="back-icon"/> 
            </router-link>
            <h2>
                Criar cliente
            </h2>
        </div>

        <div class="box-area">
            <div class="row">
                <div class="col-12 col-md-6">
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
                <div class="col-12 col-md-6">
                    <InputComponent 
                        label-name="E-mail"
                        :isRequired="true"
                        :isValid="v$.email.$error"
                        error-message="Campo obrigatório"
                    >
                        <input 
                            :class="{'error-input': v$.email.$error}"
                            v-model="body.email"
                        />
                    </InputComponent>
                </div>
                <div class="col-12 col-md-6">
                    <InputComponent 
                        label-name="Telefone"
                        :isRequired="true"
                        :isValid="v$.phone.$error"
                        error-message="Campo obrigatório"
                    >
                        <input 
                            :class="{'error-input': v$.phone.$error}"
                            v-model="body.phone"
                            v-maska
                            data-maska="['(##) #####-####', '(##) ####-####']"
                        />
                    </InputComponent>
                </div>
                <div class="col-12 col-md-6">
                    <InputComponent 
                        label-name="Documento"
                        :isRequired="true"
                        :isValid="v$.document.$error"
                        error-message="Campo obrigatório"
                    >
                        <input 
                            :class="{'error-input': v$.document.$error}"
                            v-model="body.document"
                            v-maska 
                            data-maska="['###.###.###-##', '##.###.###/####-##']"
                        />
                    </InputComponent>
                </div>
            </div>
        </div>

        <div class="d-flex justify-content-end mt-4">
            <router-link to="clients">
                <button class="default mr-2">Cancelar</button>
            </router-link>
            <button class="primary" @click="createClient">
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
import { required, email } from '@vuelidate/validators'
import { useClientStore } from '@/stores/clients.js'
import iziToast from 'izitoast';
import router from '@/router';
import { vMaska } from "maska"

const isLoading = ref(false);

const clientStore = useClientStore();

const body = reactive({
    name: "",
    email: "",
    phone: "",
    document:""
})

const validate = computed(() => {
    return {
        name: { required },
        email:  { required },
        phone: { required },
        document: { required } 
    }
});

const v$ = useVuelidate(validate, body);

const createClient = async () => {
    isLoading.value = true;

    const result = await v$.value.$validate();

    console.log(body)

    if(result){
        clientStore.createClient(body)
        .then((response) => {
            isLoading.value = false;

            iziToast.success({
                title: 'Cliente criado com sucesso',
                position: 'bottomCenter'
            })

            setTimeout(() => {
                router.push('/clients');
            }, 300)
        })
        .catch((error) => {
            isLoading.value = false;

            iziToast.error({
                title: 'Erro:',
                message: 'Erro ao criar cliente',
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