<template>
    <div class="container-all" id="edit-seller">
        <div class="mb-4 d-flex align-items-center">
            <router-link to="/sellers">
                <font-awesome-icon icon="chevron-left" class="back-icon"/> 
            </router-link>
            <h2>
                Detalhes do usuário
            </h2>
        </div>

        <div class="d-flex align-items-center justify-content-center mt-5 mb-5" v-if="isLoading">
            <Loading />
        </div>


        <div class="box-area" v-else>
            <div class="d-flex mb-1">
                <b>ID</b>:
                <p class="ml-1">{{sellerData?.id}}</p>
            </div>
            <div class="d-flex mb-1">
                <b>Nome</b>:
                <p class="ml-1">{{sellerData?.name}}</p>
            </div>
            <div class="d-flex">
                <b>E-mail:</b>
                <p class="ml-1">{{sellerData?.email}}</p>
            </div>
            <div class="d-flex mb-1">
                <b>Documento</b>:
                <p class="ml-1">{{sellerData?.cpf}}</p>
            </div>
            <div class="d-flex">
                <b>Telefone:</b>
                <p class="ml-1">{{sellerData?.phone}}</p>
            </div>
            <div class="d-flex">
                <b>Permissão:</b>
                <p class="ml-1">{{translateName(sellerData?.role)}}</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useSellerStore } from '@/stores/sellers.js'
import Loading from '@/components/Loading.vue'
import router from '@/router';

const isLoading = ref(false);

const route = useRoute();

const sellerId = route.params.id.toString();
const sellerData = ref();
const sellerStore = useSellerStore();

const getSellerById = () => {
    isLoading.value = true;

    sellerStore.getSellerById(sellerId)
    .then((response) => {
        sellerData.value = response;
        isLoading.value = false;
    })
    .catch((error) => {
        console.log(error);
        isLoading.value = false;
    })
}

getSellerById();

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

function translateName(key:string) {
    const permission = rolesList.find(role => role.key === key);
    return permission?.name;
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