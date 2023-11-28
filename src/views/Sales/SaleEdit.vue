<template>
    <div class="container-all" id="add-sale">
        <div class="mb-4 d-flex align-items-center">
            <router-link to="/sales">
                <font-awesome-icon icon="chevron-left" class="back-icon"/> 
            </router-link>
            <h2>
                Editar venda
            </h2>
        </div>

        <div class="box-area">
            <div class="row">
                <div class="col-12 col-md-6">
                    <InputComponent 
                        label-name="Cliente"
                        :isRequired="true"
                        :isValid="v$.clientId.$error"
                        error-message="Selecione uma opção"
                    >
                        <VueMultiselect
                            :class="{'error-input': v$.clientId.$error}"
                            :model-value="client"
                            :options="clientsList"
                            :searchable="true"
                            :multiple="false"
                            :showLabels="true"
                            :close-on-select="true"
                            :allow-empty="false"
                            label="name"
                            @update:model-value="updateSelectedClient"
                            placeholder="Selecione um cliente"
                            track-by="id"
                        />
                    </InputComponent>
                </div>
                <div class="col-12 col-md-6">
                    <InputComponent 
                        label-name="Vendedor"
                        :isRequired="true"
                        :isValid="v$.sellerId.$error"
                        error-message="Selecione uma opção"
                    >
                        <VueMultiselect
                            :class="{'error-input': v$.sellerId.$error}"
                            :model-value="seller"
                            :options="sellersList"
                            :searchable="true"
                            :multiple="false"
                            :showLabels="true"
                            :close-on-select="true"
                            :allow-empty="false"
                            label="name"
                            @update:model-value="updateSelectedSeller"
                            placeholder="Selecione um vendedor"
                            track-by="id"
                        />
                    </InputComponent>
                </div>
                <div>
                    <InputComponent 
                        label-name="Produto"
                        :isRequired="false"
                        :isValid="true"
                    >
                        <div class="row">
                            <div class="col-12 col-md-7 col-auto">
                                <VueMultiselect
                                    :model-value="selectedProduct"
                                    :options="productListAll"
                                    :searchable="true"
                                    :multiple="false"
                                    :showLabels="true"
                                    :close-on-select="true"
                                    :allow-empty="false"
                                    label="name"
                                    @update:model-value="updateSelectedProduct"
                                    placeholder="Selecione um produto"
                                    track-by="id"
                                />
                            </div>
                            <div class="col-12 col-md-2">
                                <input 
                                    type="number" 
                                    class="w-100"
                                    v-model="productQuantityValue" 
                                />
                            </div>
                            <div class="col-12 col-md-3">
                                <button 
                                    @click="addProduct(selectedProduct)"
                                    class="primary w-100"
                                >
                                    Adicionar produto
                                </button>
                            </div>
                        </div>
                    </InputComponent>

                    <table class="main-table mt-4 mb-4" v-if="productList.length > 0">
                        <tbody>
                            <tr class="table-product">
                                <th>Nome</th>
                                <th>Preço</th>
                                <th>Quantidade</th>
                                <th>Ações</th>
                            </tr>
                            <tr v-for="(product, index) in productList" :key="product.id">
                                <td data-th="Nome">
                                    {{product.name}}
                                </td>
                                <td data-th="Preço">
                                    {{product.price}}
                                </td>
                                <td data-th="Quantidade">
                                    {{ getQuantitiesByIds(saleData, product) }}
                                </td>
                                <td data-th="Ações">
                                    <div class="d-flex">
                                        <div @click="removeProduct(product, index)">
                                            <font-awesome-icon icon="trash" class="action-icon c-pointer"/> 
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="col-12 col-md-6">
                    <InputComponent 
                        label-name="Método de pagamento"
                        :isRequired="true"
                        :isValid="v$.paymentMethod.$error"
                        error-message="Campo obrigatório"
                    >
                        <input 
                            :class="{'error-input': v$.paymentMethod.$error}"
                            v-model="editable.paymentMethod"
                        />
                    </InputComponent>
                </div>
                <div class="col-12 col-md-6">
                    <InputComponent 
                        label-name="Notas da venda"
                        :isRequired="false"
                    >
                        <input 
                            v-model="editable.saleNotes"
                        />
                    </InputComponent>
                </div>
                <div class="col-12 col-md-6">
                    <InputComponent 
                        label-name="Porcentagem de comissão do vendedor (%)"
                        :isRequired="false"
                    >
                        <input 
                            v-model="editable.commissionForSeller"
                            v-maska
                            data-maska="['#.##', '##.##', '###.##']"
                        />
                    </InputComponent>
                </div>
            </div>
        </div>

        <div class="d-flex justify-content-end mt-4">
            <button class="default mr-2">Cancelar</button>
            <button class="primary" @click="createSale">
                <font-awesome-icon icon="spinner" class="icon-loading" v-if="isLoading"/> 
                Salvar
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed, watch } from 'vue';
import InputComponent from '@/components/form/Input.vue'
import Loading from '@/components/Loading.vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import { useSaleStore } from '@/stores/sales.js'
import { useClientStore } from '@/stores/clients.js'
import { useProductStore } from '@/stores/products.js'
import { useSellerStore } from '@/stores/sellers.js'
import VueMultiselect from 'vue-multiselect'
import iziToast from 'izitoast';
import router from '@/router';
import { vMaska } from "maska"
import { useRoute } from 'vue-router';

const route = useRoute();

const selectedProduct = ref();

const isLoading = ref(false);
const saleStore = useSaleStore();
const clientStore = useClientStore();
const productsStore = useProductStore();
const sellersStores = useSellerStore();

const seller = ref();
const client = ref();
const product = ref();

const editable = reactive({
    clientId: '',
    sellerId: '',
    productId: '',
    products: [],
    paymentMethod: '',
    saleNotes: '',
    commissionForSeller: null,
    productQuantity: null
})

const validate = computed(() => {
    return {
        clientId: { required },
        sellerId: { required },
        paymentMethod: { required }
    }
});

const v$ = useVuelidate(validate, editable);

const createSale = async () => {
    isLoading.value = true;

    const result = await v$.value.$validate();

    // @ts-ignore
    editable.commissionForSeller = Number(editable.commissionForSeller);

    if(productList.value.length === 0 && productQuantity.length === undefined) {
        isLoading.value = false;
        return iziToast.error({
            title: 'Erro:',
            message: 'Selecione ao menos um produto para criar uma venda',
            position: 'bottomCenter'
        })
    }

    if(result){
        editable.products = productList.value.map((product:any) => product.id)
        editable.productQuantity = productQuantity;

        console.log(editable)

        saleStore.createSale(editable)
        .then((response) => {
            isLoading.value = false;

            iziToast.success({
                title: 'Venda criada com sucesso',
                position: 'bottomCenter'
            })

            setTimeout(() => {
                router.push('/sales');
            }, 300)
        })
        .catch((error) => {
            isLoading.value = false;

            iziToast.error({
                title: 'Erro:',
                message: 'Erro ao criar venda',
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

const saleId = route.params.id.toString();
const saleData = ref();

const getSaleById = () => {
    saleStore.getSaleById(saleId)
    .then((response) => {
        saleData.value = response;
        editable.clientId = response.clientInfo.id;
        client.value = response.clientInfo;
        editable.sellerId = response.sellerInfo.id;
        seller.value = response.sellerInfo;
        editable.products = response.productsInfos;

        productList.value = response.productsInfos;
        productQuantity = response.productQuantity;

        editable.paymentMethod = response.paymentMethod;
        editable.saleNotes = response.saleNotes;
        editable.commissionForSeller = response.commissionForSeller;
    })
}

getSaleById();

const parameters = {
    pageSize:10000,
    currentPage: 1
}

const productQuantityValue = ref(1);

const sellersList = ref([]);

const getSellers = () => {
    sellersStores.getSellers(parameters)
    .then((response) => {
        sellersList.value = response.users;
    })
}

getSellers();

const clientsList = ref([])

const getClients = () => {
    clientStore.getClients(parameters)
    .then((response) => {
        clientsList.value = response.clients;
    })
}

getClients();

const productListAll = ref([])

const getProducts = () => {
    productsStore.getProducts(parameters)
    .then((response) => {
        productListAll.value = response.products;
    })
}

getProducts();

const updateSelectedClient = async (value:any) => {
    client.value = value;
    editable.clientId = value.id;
}

const updateSelectedSeller = async (value:any) => {
    seller.value = value;
    editable.sellerId = value.id;
}

const updateSelectedProduct = async (value:any) => {
    selectedProduct.value = value;
    editable.productId = value.id;
}


const commissionForSellerValue = computed(() => editable.commissionForSeller);

watch(commissionForSellerValue, (newValue:any) => {
  if(newValue > 100) {
    // @ts-ignore
    editable.commissionForSeller = 10000;
  }
});


const productList: any = ref([]);

let productQuantity:any = reactive({});

const addProduct = (product: any | null) => {    
    if (product !== undefined && product !== null) {
        if (!productQuantity[product.id]) {
            productList.value.push(
                {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    category: product.category.name,
                    quantity: productQuantityValue.value
                }
            );
            productQuantity[product.id] = productQuantityValue.value || 1;
        } else {
            iziToast.warning({
                title: 'Aviso:',
                message: 'Este produto já foi adicionado',
                position: 'bottomCenter'
            });
        }
        selectedProduct.value = null;
    } else {
        iziToast.error({
            title: 'Erro:',
            message: 'Selecione um produto antes de adicionar',
            position: 'bottomCenter'
        });
    }
};

const removeProduct = (selectedProduct: any, index: number) => {
    if (productQuantity[selectedProduct.id.id] > 1) {
        productQuantity[selectedProduct.id.id]--;
    } else {
        productList.value.splice(index, 1);
        delete productQuantity[selectedProduct.id];
    }
};

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
.table-product {
    background-color: $primary-color !important;
    color: white !important;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.icon-loading {
  animation: spin 1s linear infinite;
}
</style>