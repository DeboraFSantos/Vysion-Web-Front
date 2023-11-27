<template>
    <div class="container-all" id="edit-category">
        <div class="mb-4 d-flex align-items-center">
            <router-link to="/categories">
                <font-awesome-icon icon="chevron-left" class="back-icon"/> 
            </router-link>
            <h2>
                Detalhes da categoria
            </h2>
        </div>

        <div class="d-flex align-items-center justify-content-center mt-5 mb-5" v-if="isLoading">
            <Loading />
        </div>


        <div class="box-area" v-else>
            <div class="d-flex mb-1">
                <b>ID</b>:
                <p class="ml-1">{{categoryData?.id}}</p>
            </div>
            <div class="d-flex mb-1">
                <b>Nome</b>:
                <p class="ml-1">{{categoryData?.name}}</p>
            </div>
            <div class="d-flex mb-1">
                <b>Descrição</b>:
                <p class="ml-1">{{categoryData?.description}}</p>
            </div>
            <div class="d-flex">
                <b>Ativo:</b>
                <p class="ml-1">{{categoryData?.isActive ? 'Sim' : 'Não'}}</p>
            </div>

            <div class="d-flex justify-content-end mt-2" v-if="currentRole === 'admin'">
                <button
                    class="danger"
                    data-toggle="modal" 
                    data-target="#allModal"
                >
                    <font-awesome-icon icon="trash" class="action-icon c-pointer"/> 
                    Deletar categoria
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
                Tem certeza que deseja excluir essa categoria?
            </div>
            <div class="modal-footer">
                <button type="button" class="default" data-dismiss="modal">Fechar</button>
                <button type="button" class="danger" @click="deleteCategory(categoryData.id)">Deletar categoria</button>
            </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useCategoryStore } from '@/stores/categories.js'
import Loading from '@/components/Loading.vue'
import router from '@/router';
import { helpers } from '@/utils/helpers'

const isLoading = ref(false);

const route = useRoute();
const currentRole = ref(helpers.getCurrentRole());

const categoryId = route.params.id.toString();
const categoryData = ref();
const categoryStore = useCategoryStore();

const getCategoryById = () => {
    isLoading.value = true;

    categoryStore.getCategoryById(categoryId)
    .then((response) => {
        categoryData.value = response;
        isLoading.value = false;
    })
    .catch((error) => {
        console.log(error);
        isLoading.value = false;
    })
}

getCategoryById();

const deleteCategory = (id:string) => {
    isLoading.value = true;
    categoryStore.deleteCategory(id)
    .then((response) => {
        router.push('/categories');
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
</style>