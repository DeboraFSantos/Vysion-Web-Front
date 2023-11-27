import { defineStore } from 'pinia';
import { getCategories, createCategory, getCategoryById, updateCategory, deleteCategory } from '@/services/categories.service';

export const useCategoryStore = defineStore({
  id: 'categoryStore',
  state: () => ({
    categories: [],
  }),
  actions: {
    async getCategories(queryParams:any) {
      try {
        const categories = await getCategories(queryParams);
        
        return categories;
      } catch (error) {
        console.error('Erro ao listar categorias:', error);
      }
    },
    async createCategory(body:any) {
      try {
        const categories = await createCategory(body);
        
        return categories;
      } catch (error) {
        console.error('Erro ao criar categoria:', error);

        return error;
      }
    },
    async getCategoryById(id:string) {
      try {
        const category = await getCategoryById(id);
        
        return category;
      } catch (error) {
        console.error('Erro ao obter o categoria com ID:', error);

        return error;
      }
    },
    async updateCategory(id:string, body:any) {
      try {
        const category = await updateCategory(id, body);
        
        return category;
      } catch (error) {
        console.error('Erro ao atualizar o categoria:', error);

        return error;
      }
    },
    async deleteCategory(id:string) {
      try {
        return await deleteCategory(id);
      } catch (error) {
        return error;
      }
    }
  },
});