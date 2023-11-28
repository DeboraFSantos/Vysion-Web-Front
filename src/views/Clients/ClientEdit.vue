<template>
    <div class="container-all" id="edit-client">
        <div class="mb-4 d-flex align-items-center">
            <router-link to="/clients">
                <font-awesome-icon icon="chevron-left" class="back-icon"/> 
            </router-link>
            <h2>
                Editar cliente
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
                            v-model="editable.name"
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
                            v-model="editable.email"
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
                            v-model="editable.phone"
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
                            v-model="editable.document"
                            v-maska 
                            data-maska="['###.###.###-##', '##.###.###/####-##']"
                        />
                    </InputComponent>
                </div>
            </div>
        </div>

        <div class="d-flex justify-content-end mt-4">
            <button class="default mr-2">Cancelar</button>
            <button class="primary" @click="updateClient">
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
import { useClientStore } from '@/stores/clients.js'
import iziToast from 'izitoast';
import router from '@/router';
import { useRoute } from 'vue-router';

const route = useRoute();

const isLoading = ref(false);
const clientStore = useClientStore();

let editable = reactive({
    name: "",
    email: "",
    phone: "",
    document: ""
})

const validate = computed(() => {
    return {
        name: { required },
        email: { required },
        phone: { required },
        document: { required }
    }
});

const clientId = route.params.id.toString();

const v$ = useVuelidate(validate, editable);

const getClientById = () => {
    clientStore.getClientById(clientId)
    .then((response) => {
        editable.name = response.name;
        editable.email = response.email;
        editable.phone = response.phone;
        editable.document = response.document;
    })
}

getClientById();

const updateClient = async () => {
    isLoading.value = true;

    const result = await v$.value.$validate();

    if(result){
        clientStore.updateClient(clientId, JSON.stringify(editable))
        .then((response) => {
            isLoading.value = false;

            iziToast.success({
                title: 'Cliente editado com sucesso',
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
                message: 'Erro ao editar cliente',
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