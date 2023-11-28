<template>
    <div class="container-all" id="add-product">
        <div class="mb-4 d-flex align-items-center">
            <router-link to="/products">
                <font-awesome-icon icon="chevron-left" class="back-icon"/> 
            </router-link>
            <h2>
                Criar produto
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
                            v-model="body.name"
                        />
                    </InputComponent>
                </div>
                <div class="col-12 col-md-4">
                    <InputComponent 
                        label-name="Descrição"
                        :isRequired="false"
                    >
                        <input 
                            v-model="body.description"
                        />
                    </InputComponent>
                </div>
                <div class="col-12 col-md-4">
                    <InputComponent 
                        label-name="Categoria"
                        :isRequired="true"
                        :isValid="v$.categoryId.$error"
                        error-message="Selecione uma opção"
                    >
                        <VueMultiselect
                            :class="{'error-input': v$.categoryId.$error}"
                            :model-value="category"
                            :options="categoriesList"
                            :searchable="true"
                            :multiple="false"
                            :showLabels="true"
                            :close-on-select="true"
                            :allow-empty="false"
                            label="name"
                            @update:model-value="updateSelected"
                            placeholder="Selecione uma categoria"
                            track-by="id"
                        />
                    </InputComponent>
                </div>
                <div class="col-12 col-md-4">
                    <InputComponent 
                        label-name="SKU"
                        :isRequired="true"
                        :isValid="v$.sku.$error"
                        error-message="Campo obrigatório"
                    >
                        <input 
                            :class="{'error-input': v$.sku.$error}"
                            v-model="body.sku"
                        />
                    </InputComponent>
                </div>
                <div class="col-12 col-md-4">
                    <InputComponent 
                        label-name="Preço"
                        :isRequired="true"
                        :isValid="v$.price.$error"
                        error-message="Campo obrigatório"
                    >
                        <input 
                            :class="{'error-input': v$.price.$error}"
                            v-model="body.price"
                            v-money3="config"
                        />
                    </InputComponent>
                </div>
                <div class="col-12 col-md-4 d-flex align-items-center mt-3">
                    <label class="switch">
                        <input type="checkbox" v-model="body.isActive" checked>
                        <span class="slider round"></span>
                    </label>
                    <div class="isActive">Ativa</div>
                </div>
            </div>
        </div>

        <div class="d-flex justify-content-end mt-4">
            <button class="default mr-2">Cancelar</button>
            <button class="primary" @click="createProduct">
                <font-awesome-icon icon="spinner" class="icon-loading" v-if="isLoading"/> 
                Salvar
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from 'vue';
import InputComponent from '@/components/form/Input.vue'
import Loading from '@/components/Loading.vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import { useProductStore } from '@/stores/products.js'
import { useCategoryStore } from '@/stores/categories.js'
import VueMultiselect from 'vue-multiselect'
import iziToast from 'izitoast';
import router from '@/router';

const config = {
    prefix: 'R$',
    suffix: '',
    thousands: ',',
    decimal: '.',
    precision: 2,
    disableNegative: false,
    disabled: false,
    min: null,
    max: null,
    allowBlank: false,
    minimumNumberOfCharacters: 0,
    shouldRound: true,
    focusOnRight: false,
}

const isLoading = ref(false);
const productStore = useProductStore();
const categoryStore = useCategoryStore();

const category = ref();

const body = reactive({
    name: "",
    description: "",
    categoryId: "",
    sku: "",
    price: '',
    isActive: false,
})

const validate = computed(() => {
    return {
        name: { required },
        categoryId: { required },
        sku: { required },
        price: { required }
    }
});

const v$ = useVuelidate(validate, body);

const createProduct = async () => {
    isLoading.value = true;

    const result = await v$.value.$validate();

    body.price = body.price.replace(/[R$.]/g, "");

    if(result){
        productStore.createProduct(body)
        .then((response) => {
            isLoading.value = false;

            iziToast.success({
                title: 'Produto criado com sucesso',
                position: 'bottomCenter'
            })

            setTimeout(() => {
                router.push('/products');
            }, 300)
        })
        .catch((error) => {
            isLoading.value = false;

            iziToast.error({
                title: 'Erro:',
                message: 'Erro ao criar produto',
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

const parameters = {
    pageSize:10000,
    currentPage: 1
}

const categoriesList = ref([]);

const getCategories = () => {
    categoryStore.getCategories(parameters)
    .then((response) => {
        const activeCategories = response.categories.filter((cat:any) => cat.isActive);
        categoriesList.value = activeCategories;
    })
}

getCategories();

const updateSelected = async (value:any) => {
    category.value = value;
    body.categoryId = value.id;
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