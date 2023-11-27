import { defineStore } from 'pinia';
import { getProducts, createProduct, getProductById, updateProduct, deleteProduct } from '@/services/products.service';

export const useProductStore = defineStore({
  id: 'productStore',
  state: () => ({
    products: [],
  }),
  actions: {
    async getProducts(queryParams:any) {
      try {
        const products = await getProducts(queryParams);
        
        return products;
      } catch (error) {
        console.error('Erro ao listar produtos:', error);

        return error;
      }
    },
    async createProduct(body:any) {
      try {
        const products = await createProduct(body);
        
        return products;
      } catch (error) {
        console.error('Erro ao criar produto:', error);

        return error;
      }
    },
    async getProductById(id:string) {
      try {
        const product = await getProductById(id);
        
        return product;
      } catch (error) {
        console.error('Erro ao obter o produto com ID:', error);

        return error;
      }
    },
    async updateProduct(id:string, body:any) {
      try {
        const product = await updateProduct(id, body);
        
        return product;
      } catch (error) {
        console.error('Erro ao atualizar o produto:', error);

        return error;
      }
    },
    async deleteProductById(id:string) {
      try {
        return await deleteProduct(id);
      } catch (error) {
        return error;
      }
    }
  },
});