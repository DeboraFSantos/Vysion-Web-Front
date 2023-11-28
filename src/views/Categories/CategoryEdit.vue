<template>
    <div class="container-all" id="edit-category">
        <div class="mb-4 d-flex align-items-center">
            <router-link to="/categories">
                <font-awesome-icon icon="chevron-left" class="back-icon"/> 
            </router-link>
            <h2>
                Editar categoria
            </h2>
        </div>

        <div class="box-area">
            <div class="row">
                <div class="col-12 col-md-4">
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
                <div class="col-12 col-md-4">
                    <InputComponent 
                        label-name="Descrição"
                        :isRequired="false"
                    >
                        <input 
                            v-model="editable.description"
                        />
                    </InputComponent>
                </div>
                <div class="col-12 col-md-4 d-flex align-items-center mt-3">
                    <label class="switch">
                        <input type="checkbox" v-model="editable.isActive" checked>
                        <span class="slider round"></span>
                    </label>
                    <div class="isActive">Ativa</div>
                </div>
            </div>
        </div>

        <div class="d-flex justify-content-end mt-4">
            <button class="default mr-2">Cancelar</button>
            <button class="primary" @click="updateCategory">
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
import { useRoute } from 'vue-router';

const route = useRoute();

const isLoading = ref(false);
const categoryStore = useCategoryStore();

const category = ref();

let editable = reactive({
    name: "",
    description: "",
    isActive: false,
})

const validate = computed(() => {
    return {
        name: { required }
    }
});

const categoryId = route.params.id.toString();

const v$ = useVuelidate(validate, editable);

const getCategoryById = () => {
    categoryStore.getCategoryById(categoryId)
    .then((response) => {
        editable.name = response.name;
        editable.description = response.description;
        editable.isActive = response.isActive;
    })
}

getCategoryById();

const updateCategory = async () => {
    isLoading.value = true;

    const result = await v$.value.$validate();

    if(result){
        categoryStore.updateCategory(categoryId, JSON.stringify(editable))
        .then((response) => {
            isLoading.value = false;

            iziToast.success({
                title: 'Categoria editada com sucesso',
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
                message: 'Erro ao editar categoria',
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