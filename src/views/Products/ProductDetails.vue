<template>
    <div class="container-all" id="edit-product">
        <div class="mb-4 d-flex align-items-center">
            <router-link to="/products">
                <font-awesome-icon icon="chevron-left" class="back-icon"/> 
            </router-link>
            <h2>
                Detalhes do produto
            </h2>
        </div>

        <div class="d-flex align-items-center justify-content-center mt-5 mb-5" v-if="isLoading">
            <Loading />
        </div>


        <div class="box-area" v-else>
            <div class="d-flex mb-1">
                <b>ID</b>:
                <p class="ml-1">{{productData?.id}}</p>
            </div>
            <div class="d-flex mb-1">
                <b>Nome</b>:
                <p class="ml-1">{{productData?.name}}</p>
            </div>
            <div class="d-flex mb-1">
                <b>Descrição</b>:
                <p class="ml-1">{{productData?.description}}</p>
            </div>
            <div class="d-flex mb-1">
                <b>Preço</b>:
                <p class="ml-1">{{helpers.centsToReal(productData?.name)}}</p>
            </div>
            <div class="d-flex mb-1">
                <b>SKU</b>:
                <p class="ml-1">{{productData?.sku}}</p>
            </div>
            <div class="d-flex mb-1">
                <b>Categoria:</b>
                <p class="ml-1">{{productData?.category.name }}</p>
            </div>
            <div class="d-flex">
                <b>Ativo:</b>
                <p class="ml-1">{{productData?.isActive ? 'Sim' : 'Não'}}</p>
            </div>

            <div class="d-flex justify-content-end mt-2" v-if="currentRole === 'admin'">
                <button
                    class="danger"
                    data-toggle="modal" 
                    data-target="#allModal"
                >
                    <font-awesome-icon icon="trash" class="action-icon c-pointer"/> 
                    Deletar produto
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
                Tem certeza que deseja excluir esse produto?
            </div>
            <div class="modal-footer">
                <button type="button" class="default" data-dismiss="modal">Fechar</button>
                <button type="button" class="danger" @click="deleteProduct(productData.id)">Deletar produto</button>
            </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useProductStore } from '@/stores/products.js'
import Loading from '@/components/Loading.vue'
import { helpers } from '@/utils/helpers'
import router from '@/router';

const isLoading = ref(false);

const route = useRoute();

const productId = route.params.id.toString();
const productData = ref();
const productStore = useProductStore();
const currentRole = ref(helpers.getCurrentRole());

const getProductById = () => {
    isLoading.value = true;

    productStore.getProductById(productId)
    .then((response) => {
        productData.value = response;
        isLoading.value = false;
    })
    .catch((error) => {
        console.log(error);
        isLoading.value = false;
    })
}

getProductById();

const modalRef = ref(null);

const deleteProduct = (id:string) => {
    isLoading.value = true;
    productStore.deleteProductById(id)
    .then((response) => {
        router.push('/products');
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
.action-icon {
    margin-right:4px;
}

.close {
    padding:0px;
    font-size:25px;
}
</style>