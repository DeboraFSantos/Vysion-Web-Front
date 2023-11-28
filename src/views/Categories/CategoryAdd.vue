<template>
    <div class="container-all" id="add-category">
        <div class="mb-4 d-flex align-items-center">
            <router-link to="/categories">
                <font-awesome-icon icon="chevron-left" class="back-icon"/> 
            </router-link>
            <h2>
                Criar categoria
            </h2>
        </div>

        <div class="box-area">
            <div class="row">
                <div class="col-12 col-md-5">
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
                <div class="col-12 col-md-5">
                    <InputComponent 
                        label-name="Descrição"
                        :isRequired="false"
                    >
                        <input 
                            v-model="body.description"
                        />
                    </InputComponent>
                </div>
                <div class="col-12 col-md-2 d-flex align-items-center mt-3">
                    <label class="switch">
                        <input type="checkbox" v-model="body.isActive" checked>
                        <span class="slider round"></span>
                    </label>
                    <div class="isActive">Ativa</div>
                </div>
            </div>
        </div>

        <div class="d-flex justify-content-end mt-4">
            <router-link to="categories">
                <button class="default mr-2">Cancelar</button>
            </router-link>
            <button class="primary" @click="createCategory">
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
import { useCategoryStore } from '@/stores/categories.js'
import iziToast from 'izitoast';
import router from '@/router';

const isLoading = ref(false);

const categoryStore = useCategoryStore();

const body = reactive({
    name: "",
    description: "",
    isActive: false,
})

const validate = computed(() => {
    return {
        name: { required }
    }
});

const v$ = useVuelidate(validate, body);

const createCategory = async () => {
    isLoading.value = true;

    const result = await v$.value.$validate();

    if(result){
        categoryStore.createCategory(body)
        .then((response) => {
            isLoading.value = false;

            iziToast.success({
                title: 'Categoria criada com sucesso',
                position: 'bottomCenter'
            })

            setTimeout(() => {
                router.push('/categories');
            }, 300)
        })
        .catch((error) => {
            isLoading.value = false;

            iziToast.error({
                title: 'Erro:',
                message: 'Erro ao criar categoria',
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