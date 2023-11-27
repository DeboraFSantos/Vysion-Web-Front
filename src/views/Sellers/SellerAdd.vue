<template>
    <div class="container-all" id="add-seller">
        <div class="mb-4 d-flex align-items-center">
            <router-link to="/sellers">
                <font-awesome-icon icon="chevron-left" class="back-icon"/> 
            </router-link>
            <h2>
                Criar usuário
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
                <div class="col-12 col-md-4">
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
                <div class="col-12 col-md-4">
                    <InputComponent 
                        label-name="Documento"
                        :isRequired="true"
                        :isValid="v$.cpf.$error"
                        error-message="Campo obrigatório"
                    >
                        <input 
                            :class="{'error-input': v$.cpf.$error}"
                            v-model="body.cpf"
                            v-maska 
                            data-maska="###.###.###-##"
                        />
                    </InputComponent>
                </div>
                <div class="col-12 col-md-4">
                    <InputComponent 
                        label-name="Permissão"
                        :isRequired="true"
                        :isValid="v$.role.$error"
                        error-message="Selecione uma opção"
                    >
                        <VueMultiselect
                            :class="{'error-input': v$.role.$error}"
                            :model-value="role"
                            :options="rolesList"
                            :searchable="true"
                            :multiple="false"
                            :showLabels="true"
                            :close-on-select="true"
                            :allow-empty="false"
                            label="name"
                            @update:model-value="updateSelected"
                            placeholder="Selecione uma permissão"
                            track-by="key"
                        />
                    </InputComponent>
                </div>
            </div>
        </div>

        <div class="d-flex justify-content-end mt-4">
            <router-link to="sellers">
                <button class="default mr-2">Cancelar</button>
            </router-link>
            <button class="primary" @click="createSeller">
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
import { useSellerStore } from '@/stores/sellers.js'
import iziToast from 'izitoast';
import router from '@/router';
import { vMaska } from "maska"
import VueMultiselect from 'vue-multiselect'

const isLoading = ref(false);

const sellerStore = useSellerStore();

const role = ref();

const body = reactive({
    name: "",
    email: "",
    phone: "",
    cpf:"",
    role:""
})

const validate = computed(() => {
    return {
        name: { required },
        email:  { required },
        phone: { required },
        cpf: { required },
        role: { required } 
    }
});

const v$ = useVuelidate(validate, body);

const createSeller = async () => {
    isLoading.value = true;

    const result = await v$.value.$validate();

    if(result){
        sellerStore.createSeller(body)
        .then((response) => {
            isLoading.value = false;

            iziToast.success({
                title: 'Vendedor criado com sucesso',
                position: 'bottomCenter'
            })

            setTimeout(() => {
                router.push('/sellers');
            }, 300)
        })
        .catch((error) => {
            isLoading.value = false;

            iziToast.error({
                title: 'Erro:',
                message: 'Erro ao criar vendedor',
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

const updateSelected = async (value:any) => {
    role.value = value;
    body.role = value.key;
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