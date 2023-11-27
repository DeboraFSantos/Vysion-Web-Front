<template>
    <div class="container-all" id="edit-sale">
        <div class="mb-4 d-flex align-items-center">
            <router-link to="/sales">
                <font-awesome-icon icon="chevron-left" class="back-icon"/> 
            </router-link>
            <h2>
                Detalhes da venda
            </h2>
        </div>

        <div class="d-flex align-items-center justify-content-center mt-5 mb-5" v-if="isLoading">
            <Loading />
        </div>


        <div class="box-area" v-else>
            <div class="d-flex mb-1">
                <b>ID</b>:
                <p class="ml-1">{{saleData?.id}}</p>
            </div>
            <div class="d-flex mb-1">
                <b>Nome do Cliente</b>:
                <p class="ml-1">{{saleData?.clientInfo?.name}}</p>
            </div>
            <div class="d-flex mb-1">
                <b>Nome do Vendedor</b>:
                <p class="ml-1">{{saleData?.sellerInfo?.name}}</p>
            </div>
            <div class="d-flex mb-1">
                <b>Valor total da venda</b>:
                <p class="ml-1">{{helpers.centsToReal(saleData?.totalSale)}}</p>
            </div>
            <div class="d-flex mb-1">
                <b>Comissão do vendedor</b>:
                <p class="ml-1">{{helpers.centsToReal(saleData?.commissionForSellerValue)}}</p>
            </div>
            <div class="d-flex mb-1">
                <b>Data de criação</b>:
                <p class="ml-1">{{helpers.formatDate(saleData?.createdDate)}}</p>
            </div>

            <div class="d-flex justify-content-end mt-2" v-if="currentRole === 'admin'">
                <button
                    class="danger"
                    data-toggle="modal" 
                    data-target="#allModal"
                >
                    <font-awesome-icon icon="trash" class="action-icon c-pointer"/> 
                    Deletar venda
                </button>
            </div>
        </div>

        <h4 class="mt-4">Produtos da venda</h4>   
        <table class="main-table mt-3 mb-4" v-if="saleData?.productsInfos?.length > 0">
            <tbody>
                <tr class="table-product">
                    <th>Nome</th>
                    <th>Preço</th>
                    <th>Quantidade</th>
                    <th>Valor somado</th>
                </tr>
                <tr v-for="(product, index) in saleData?.productsInfos" :key="product.id">
                    <td data-th="Nome">
                        {{product.name}}
                    </td>
                    <td data-th="Preço">
                        {{helpers.centsToReal(product.price)}}
                    </td>
                    <td data-th="Quantidade">
                        {{ getQuantitiesByIds(saleData, product) }}
                    </td>
                    <td data-th="Valor somado">
                        {{ helpers.centsToReal(product.price * getQuantitiesByIds(saleData, product)) }}
                    </td>
                </tr>
            </tbody>
        </table>
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
                Tem certeza que deseja excluir essa venda?
            </div>
            <div class="modal-footer">
                <button type="button" class="default" data-dismiss="modal">Fechar</button>
                <button type="button" class="danger" @click="deleteSale(saleData.id)">Deletar venda</button>
            </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useSaleStore } from '@/stores/sales.js'
import Loading from '@/components/Loading.vue'
import { helpers } from '@/utils/helpers'
import router from '@/router';

const isLoading = ref(false);

const route = useRoute();

const saleId = route.params.id.toString();
const saleData = ref();
const saleStore = useSaleStore();
const currentRole = ref(helpers.getCurrentRole());

const getSaleById = () => {
    isLoading.value = true;

    saleStore.getSaleById(saleId)
    .then((response) => {
        saleData.value = response;
        isLoading.value = false;
    })
    .catch((error) => {
        console.log(error);
        isLoading.value = false;
    })
}

getSaleById();

const getQuantitiesByIds = (product: any, singleProduct:any) => {
  let quantityFound = 0;

  const ids = Object.keys(product?.productQuantity)
  
  ids.forEach(id => {
    const foundProduct = singleProduct.id === id;
    if (foundProduct) {
        quantityFound = product?.productQuantity[id];
    }
  });

  return quantityFound;
}

const deleteSale = (id:string) => {
    isLoading.value = true;
    saleStore.deleteSale(id)
    .then((response) => {
        router.push('/sales');
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
h4 {
    font-size:1.1rem;
    font-weight: 700;
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
.table-product {
    background-color: $primary-color !important;
    color: white !important;
}
</style>