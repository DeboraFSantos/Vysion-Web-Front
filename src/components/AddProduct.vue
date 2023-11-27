<template>
    <div>
      <div v-for="(item, index) in productList" :key="index">
        <select v-model="item.productId">
          <option value="123">Produto 1</option>
          <option value="234">Produto 2</option>
        </select>
        <button @click="removeProduct(index)">Remover</button>
      </div>
      <button @click="addProduct">Adicionar produto</button>
      <pre>{{ productList }}</pre>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  interface Product {
    productId: string;
  }
  
  const productList = ref<Product[]>([]);
  
  const addProduct = () => {
    productList.value.push({ productId: '' });
  };
  
  const removeProduct = (index: number) => {
    productList.value.splice(index, 1);
  };
  </script>
  