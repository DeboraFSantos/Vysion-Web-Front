<template>
    <div class="container-all" id="summary">
        <h2 class="mt-3 mb-4">
            Dashboard
        </h2>

        <div class="d-flex align-items-center justify-content-center mt-5 mb-5" v-if="isLoading">
            <Loading />
        </div>

        <div v-else>
            <div class="box-area">
                <apexchart type="line" height="350" :options="totalSalesChartValue" :series="totalSalesSeries"></apexchart>
            </div>

            <div class="row mt-4">
                <div class="col-12 col-md-6 mb-4">
                    <div class="box-area">
                        <apexchart type="bar" height="350" :options="topSellerRankingChartValue" :series="topSellerRankingSeries"></apexchart>
                    </div>
                </div>
                <div class="col-12 col-md-6">
                    <div class="box-area">
                        <apexchart type="bar" height="350" :options="topBuyingClientsChartValue" :series="topBuyingClientsSeries"></apexchart>
                    </div>
                </div>
            </div>

            <div class="row mt-4">
                <div class="col-12 col-md-6 mb-4">
                    <div class="box-area">
                        <apexchart type="bar" height="350" :options="TopSoldProductsChartValue" :series="TopSoldProductsSeries"></apexchart>
                    </div>
                </div>
                <div class="col-12 col-md-6">
                    <div class="box-area">
                        <apexchart type="bar" height="350" :options="TopSoldCategoriesChartValue" :series="TopSoldCategoriesSeries"></apexchart>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useSaleStore } from '@/stores/sales.js'
import { helpers } from '@/utils/helpers'
import Loading from '@/components/Loading.vue'
import dayjs from 'dayjs'
const saleStore = useSaleStore();

const parameters = reactive({
    startDate:dayjs().subtract(60, 'day').format('YYYY-MM-DD'),
    endDate:dayjs().add(1, 'day').format('YYYY-MM-DD')
})

const totalSales = ref();

const isLoading = ref(false);

const getTotalSalesStatistics = async (params: any) => {
    isLoading.value = true;

    await saleStore.getTotalSalesStatistics(params)
    .then((response) => {
        totalSales.value = response;

        const formattedDates = Object.keys(totalSales.value).map(date => helpers.formatDate(date));

        totalSalesChartValue.value = {
            ...totalSalesChartOptions,
            xaxis: {
                categories: formattedDates
            }
        }

        totalSalesSeries.value.push(
            {
                name:'Total',
                data:Object.values(totalSales.value)
            }
        )

        isLoading.value = false;
    })
    .catch((error) => {
        console.log(error);
        isLoading.value = false;
    })
}

getTotalSalesStatistics(parameters)

const totalSalesSeries: any = ref([]);

const totalSalesChartValue = ref({});

const totalSalesChartOptions = {
    colors:['#8652ff'],
    chart: {
        height: 350,
        type: 'line',
        zoom: {
            enabled: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'straight',
        width: 2
    },
    title: {
        text: 'Vendas nos últimos meses',
        align: 'left'
    },
    grid: {
        row: {
        colors: ['#f3f3f3', 'transparent'], 
        opacity: 0.5
        },
    }
}

const sellerRanking = ref();

const getTopSellerRanking = async (params: any) => {
    isLoading.value = true;

    await saleStore.getTopSellerRanking(params)
    .then((response) => {
        sellerRanking.value = response;

        const sellerNames = sellerRanking.value.map((seller:any) => seller.sellerName);

        const totalSales = sellerRanking.value.map((seller:any) => seller.totalSales);

        topSellerRankingChartValue.value = {
            ...topSellerRankingChartOptions,
            xaxis: {
                categories: sellerNames
            }
        }

        topSellerRankingSeries.value.push(
            {
                name:'Total',
                data:totalSales
            }
        )

        isLoading.value = false;
    })
    .catch((error) => {
        console.log(error);
        isLoading.value = false;
    })
}

getTopSellerRanking(parameters)

const topSellerRankingSeries: any = ref([]);

const topSellerRankingChartValue = ref({});

const topSellerRankingChartOptions = {
    colors:['#8652ff'],
    chart: {
        type: 'bar',
        height: 350
    },
    title: {
        text: 'Top vendedores dos últimos meses',
        align: 'left'
    },
    plotOptions: {
        bar: {
            borderRadius: 4,
            horizontal: true,
        }
    },
    dataLabels: {
        enabled: false
    }
}

const buyerRanking = ref();

const getTopBuyingClients = async (params: any) => {
    isLoading.value = true;

    await saleStore.getTopBuyingClients(params)
    .then((response) => {
        buyerRanking.value = response;

        const clientsNames = buyerRanking.value.map((buyer:any) => buyer.clientName);

        const totalPurchases = buyerRanking.value.map((buyer:any) => buyer.totalPurchases);

        topBuyingClientsChartValue.value = {
            ...topBuyingClientsChartOptions,
            xaxis: {
                categories: clientsNames
            }
        }

        topBuyingClientsSeries.value.push(
            {
                name:'Total',
                data:totalPurchases
            }
        )
        isLoading.value = false;
    })
    .catch((error) => {
        console.log(error);
        isLoading.value = false;
    })
}

getTopBuyingClients(parameters);

const topBuyingClientsSeries: any = ref([]);

const topBuyingClientsChartValue = ref({});

const topBuyingClientsChartOptions = {
    colors:['#8652ff'],
    chart: {
        type: 'bar',
        height: 350
    },
    title: {
        text: 'Top clientes dos últimos meses',
        align: 'left'
    },
    plotOptions: {
        bar: {
            borderRadius: 4,
            horizontal: true,
        }
    },
    dataLabels: {
        enabled: false
    }
}

const topSoldProducts = ref();

const getTopSoldProducts = async (params: any) => {
    isLoading.value = true;

    await saleStore.getTopSoldProducts(params)
    .then((response) => {
        topSoldProducts.value = response;

        const productsNames = topSoldProducts.value.map((product:any) => product.productName);

        const totalQuantitySold = topSoldProducts.value.map((product:any) => product.totalQuantitySold);

        TopSoldProductsChartValue.value = {
            ...TopSoldProductsChartOptions,
            xaxis: {
                categories: productsNames
            }
        }

        TopSoldProductsSeries.value.push(
            {
                name:'Total',
                data:totalQuantitySold
            }
        )

        isLoading.value = false;
    })
    .catch((error) => {
        console.log(error);
        isLoading.value = false;
    })
}

getTopSoldProducts(parameters);

const TopSoldProductsSeries: any = ref([])

const TopSoldProductsChartValue = ref({});

const TopSoldProductsChartOptions = {
    chart: {
        height: 350,
        type: 'bar'
    },
    colors: ['#8652ff'],
    plotOptions: {
        bar: {
        columnWidth: '45%',
        distributed: true,
        }
    },
    title: {
        text: 'Top produtos dos últimos meses',
        align: 'left'
    },
    dataLabels: {
        enabled: false
    },
    legend: {
        show: false
    },
    xaxis: {
        categories: [
            ['John', 'Doe'],
            ['Joe', 'Smith'],
            ['Jake', 'Williams'],
            'Amber',
            ['Peter', 'Brown'],
            ['Mary', 'Evans'],
            ['David', 'Wilson'],
            ['Lily', 'Roberts'], 
        ],
        labels: {
            style: {
                colors: ['#8652ff'],
                fontSize: '12px'
            }
        }
    }
}

const topSoldCategories = ref();

const getTopSoldCategories = async (params: any) => {
    isLoading.value = true;

    await saleStore.getTopSoldCategories(params)
    .then((response) => {
        topSoldCategories.value = response;

        const categoriesNames = topSoldCategories.value.map((category:any) => category.categoryName);

        const totalQuantitySold = topSoldCategories.value.map((category:any) => category.totalQuantitySold);

        TopSoldCategoriesChartValue.value = {
            ...TopSoldCategoriesChartOptions,
            xaxis: {
                categories: categoriesNames
            }
        }

        TopSoldCategoriesSeries.value.push(
            {
                name:'Total',
                data:totalQuantitySold
            }
        )

        isLoading.value = false;
    })
    .catch((error) => {
        console.log(error);

        isLoading.value = false;
    })
}

getTopSoldCategories(parameters);

const TopSoldCategoriesSeries: any = ref([])

const TopSoldCategoriesChartValue = ref({});

const TopSoldCategoriesChartOptions = {
    chart: {
        height: 350,
        type: 'bar'
    },
    colors: ['#8652ff'],
    plotOptions: {
        bar: {
        columnWidth: '45%',
        distributed: true,
        }
    },
    title: {
        text: 'Top categorias dos últimos meses',
        align: 'left'
    },
    dataLabels: {
        enabled: false
    },
    legend: {
        show: false
    },
    xaxis: {
        categories: [
            ['John', 'Doe'],
            ['Joe', 'Smith'],
            ['Jake', 'Williams'],
            'Amber',
            ['Peter', 'Brown'],
            ['Mary', 'Evans'],
            ['David', 'Wilson'],
            ['Lily', 'Roberts'], 
        ],
        labels: {
            style: {
                colors: ['#8652ff'],
                fontSize: '12px'
            }
        }
    }
}
</script>