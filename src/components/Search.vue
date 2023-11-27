<template>
    <div class="search-all">
        <div class="clearFilter d-flex justify-content-end">
            <button class="clearButton" @click="clearFilter" v-if="props.showClear">
                <img src="../assets/img/close.svg">
                Limpar filtro
            </button>
        </div>
        <div :class="props.showClear ? 'box-area-search' : 'box-area-search pt-4'">
            <slot></slot>
        </div>
    </div>

</template>

<script lang="ts" setup>

const props: any = defineProps({
    showClear:Boolean
})

const emit: any = defineEmits([
    "clear-filter"
])

const clearFilter = () => {
    emit('clear-filter')
}

</script>

<style lang="scss" scoped>
.search-all {
    box-shadow: 1px 0px 13px -2px rgba(0,0,0,0.03);
    -webkit-box-shadow: 1px 0px 13px -2px rgba(0,0,0,0.03);
    -moz-box-shadow: 1px 0px 13px -2px rgba(0,0,0,0.03);
    background:white;
    border-radius: 8px;
    margin-top:10px;

}
.box-area-search {
    padding:0px 20px 20px;
}

.clearButton {
    font-weight: 600;
    font-size:13px;
    padding-top:22px;
}
</style>