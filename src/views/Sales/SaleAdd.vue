<template>
    <div class="container-all" id="add-sale">
        <div class="mb-4 d-flex align-items-center">
            <router-link to="/sales">
                <font-awesome-icon icon="chevron-left" class="back-icon"/> 
            </router-link>
            <h2>
                Criar venda
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
                                    class="mb-2 mb-md-0"
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
                            <div class="col-12 col-md-2 mb-2 mb-md-0">
                                <input 
                                    type="number" 
                                    placeholder="Quantidade"
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
                                <th>Categoria</th>
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
                                <td data-th="Categoria">
                                    {{product?.category}}
                                </td>
                                <td data-th="Quantidade">
                                    {{product.quantity}}
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
                        <VueMultiselect
                            class="mb-2 mb-md-0"
                            :model-value="paymentMethod"
                            :options="paymentMethodsList"
                            :searchable="true"
                            :multiple="false"
                            :showLabels="true"
                            :close-on-select="true"
                            :allow-empty="false"
                            label="name"
                            @update:model-value="updateSelectedPayment"
                            placeholder="Selecione um meio de pagamento"
                            track-by="name"
                        />
                    </InputComponent>
                </div>
                <div class="col-12 col-md-6">
                    <InputComponent 
                        label-name="Notas da venda"
                        :isRequired="false"
                    >
                        <input 
                            v-model="body.salesNotes"
                        />
                    </InputComponent>
                </div>
                <div class="col-12 col-md-6">
                    <InputComponent 
                        label-name="Porcentagem de comissão do vendedor (%)"
                        :isRequired="false"
                    >
                        <input 
                            v-model="body.commissionForSeller"
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
import { usePaymentMethodStore } from '@/stores/paymentMethods.js'

const paymentMethodStore = usePaymentMethodStore();
const paymentMethodsList = ref([]);

const selectedProduct = ref();

const isLoading = ref(false);
const saleStore = useSaleStore();
const clientStore = useClientStore();
const productsStore = useProductStore();
const sellersStores = useSellerStore();

const seller = ref();
const client = ref();
const product = ref();
const paymentMethod = ref();

const body = reactive({
    clientId: '',
    sellerId: '',
    productId: '',
    products: [],
    paymentMethod: '',
    salesNotes: '',
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

const v$ = useVuelidate(validate, body);

const createSale = async () => {
    isLoading.value = true;

    const result = await v$.value.$validate();

    // @ts-ignore
    body.commissionForSeller = Number(body.commissionForSeller);

    if(productList.value.length === 0 && productQuantity.length === undefined) {
        isLoading.value = false;
        return iziToast.error({
            title: 'Erro:',
            message: 'Selecione ao menos um produto para criar uma venda',
            position: 'bottomCenter'
        })
    }

    if(result){
        body.products = productList.value.map((product:any) => product.id)
        body.productQuantity = productQuantity;

        saleStore.createSale(body)
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

const parameters = {
    pageSize:10000,
    currentPage: 1
}

const productQuantityValue = ref();

const sellersList = ref([]);

const getSellers = () => {
    sellersStores.getSellers(parameters)
    .then((response) => {
        const activeSellers = response.users.filter((user:any) => user.role !== 'user');
        sellersList.value = activeSellers;
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
        const activeProducts = response.products.filter((product:any) => product.isActive);
        productListAll.value = activeProducts;
    })
}

getProducts();

const updateSelectedClient = async (value:any) => {
    client.value = value;
    body.clientId = value.id;
}

const updateSelectedSeller = async (value:any) => {
    seller.value = value;
    body.sellerId = value.id;
}

const updateSelectedProduct = async (value:any) => {
    selectedProduct.value = value;
    body.productId = value.id;
}

const updateSelectedPayment= async (value:any) => {
    paymentMethod.value = value;
    body.paymentMethod = value.name;
}

const commissionForSellerValue = computed(() => body.commissionForSeller);

watch(commissionForSellerValue, (newValue:any) => {
  if(newValue > 100) {
    // @ts-ignore
    body.commissionForSeller = 10000;
  }
});


const productList: any = ref([]);

const productQuantity:any = reactive({});

const addProduct = (product: any | null) => {    
    if (product !== undefined && product !== null) {
        if (!productQuantity[product.id]) {
            productList.value.push(
                {
                    id: product?.id,
                    name: product?.name,
                    price: product?.price,
                    category: product?.category?.name,
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

const paymentParameters = reactive({
    currentPage:1,
    pageSize:1000
})

const getPaymentMethods = (params: any) => {
    isLoading.value = true;

    paymentMethodStore.getPaymentMethods(params)
    .then((response) => {
        paymentMethodsList.value = response.paymentMethods || [];

        isLoading.value = false;
    })
    .catch((error) => {
        console.log(error);
        isLoading.value = false;
    })
}

getPaymentMethods(paymentParameters);

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