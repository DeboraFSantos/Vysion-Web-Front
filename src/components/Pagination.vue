<template>
    <div>
        <div class="table-pagination flex">
            <div class="itemsToShow">
                <select v-model="itemsPerPage" @change="changeItemsPerPage($event.target.value)">
                    <option v-for="option in perPageOptions" :key="option" :value="option">
                        {{ option }}
                    </option>
                </select>
                de {{ props.totalItems }} itens
            </div>

            <div class="d-flex align-items-center">
                <button @click="previousPage" :disabled="currentPage === 1">
                    <font-awesome-icon icon="chevron-left" class="icon-table-pagination" />
                </button>
                <span class="d-flex">
                    <span v-for="pageNumber in displayedPages" :key="pageNumber">
                        <button class="pageNumber" @click="goToPage(pageNumber)" :class="{ 'active': currentPage === pageNumber }">
                            {{ pageNumber }}
                        </button>
                    </span>
                </span>
                <button @click="nextPage" :disabled="currentPage === totalPages">
                    <font-awesome-icon icon="chevron-right" class="icon-table-pagination" />
                </button>
            </div>
        </div>
    </div>
</template>
  
<script lang="ts" setup>
    import { ref, computed } from 'vue';

    const props = defineProps({
        currentPage: {
            type: Number,
            default: 1
        },
        totalItems: Number,
        perPage: [Number, String]
    })
    
    const currentPage = ref(props.currentPage);
    
    const itemsPerPage = ref(props.perPage);
    
    const totalPages = computed(() => Math.ceil(props.totalItems / itemsPerPage.value));
    
    const perPageOptions = [5, 10, 15, 20];
    
    const items = ref<Array<{ id: number; name: string }>>([]);
    for (let i = 1; i <= 100; i++) {
        items.value.push({ id: i, name: `Item ${i}` });
    }
    
    const paginatedItems = computed(() => {
        const startIndex = (currentPage.value - 1) * itemsPerPage.value;
        const endIndex = startIndex + itemsPerPage.value;
        return items.value.slice(startIndex, endIndex);
    });
    
    const displayedPages = computed(() => {
        const maxDisplayed = 5; 
        const pageCount = Math.min(totalPages.value, maxDisplayed);
        const middle = Math.ceil(pageCount / 2);
    
        if (currentPage.value <= middle) {
        return Array.from({ length: pageCount }, (_, i) => i + 1);
        } else if (currentPage.value > totalPages.value - middle) {
        return Array.from({ length: pageCount }, (_, i) => totalPages.value - pageCount + i + 1);
        } else {
        return Array.from({ length: pageCount }, (_, i) => currentPage.value - middle + i + 1);
        }
    });

    const emit: any = defineEmits([
        "changePerPage",
        "nextPage",
        "goToPage",
        "previousPage"
    ])
    
    const goToPage = (pageNumber: number) => {
        currentPage.value = pageNumber;

        emit('previousPage', currentPage.value); 
    };
    
    const nextPage = () => {
        if (currentPage.value < totalPages.value) {
            currentPage.value++;
        }

        emit('nextPage', currentPage.value); 
    };
    
    const previousPage = () => {
        if (currentPage.value > 1) {
            currentPage.value--;
        }

        emit('previousPage', currentPage.value); 
    };

    const changeItemsPerPage = (selectedValue: any) => {
        itemsPerPage.value = selectedValue; 
        emit('changePerPage', itemsPerPage.value); 
    };
</script>

<style lang="scss" scoped>
    .table-pagination {
        margin-top: 20px;
    }
    .table-pagination button {
        margin-right: 5px;
    }

    .pageNumber {
        display: flex;
        align-items: center;
        justify-content: center;
        margin:0px 5px;
        height: 35px;
        width: 35px;
        border-radius: 50%;
        background-color: #eee;
    }
    .active {
        font-weight: 500;
        background-color: #8652ff;
        text-align: center;
        border-radius: 100%;
        color: white;
    }

    .flex {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        align-items: center;
    }

    .icon-table-pagination {
        font-size:10px;
    }

    span{
        line-height: 0;
    }

    .itemsToShow {
        color:#9d9d9d;
        font-size:13px;
    }

    select {
        border-radius: 8px;
        padding:5px;
        margin-right:5px;
        border:none;

        &:focus, &:hover {
            outline: none;
        }
    }

    @media screen and (max-width:700px){
        .flex {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex-basis: 100%;
        }
    }
</style>
