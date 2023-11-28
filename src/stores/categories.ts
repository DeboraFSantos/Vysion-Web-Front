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
        return undefined;
      }
    },
    async createCategory(body:any) {
      try {
        const categories = await createCategory(body);
        
        return categories;
      } catch (error) {
        return undefined;
      }
    },
    async getCategoryById(id:string) {
      try {
        const category = await getCategoryById(id);
        
        return category;
      } catch (error) {
        return undefined;
      }
    },
    async updateCategory(id:string, body:any) {
      try {
        const category = await updateCategory(id, body);
        
        return category;
      } catch (error) {
        return undefined;
      }
    },
    async deleteCategory(id:string) {
      try {
        return await deleteCategory(id);
      } catch (error) {
        return undefined;
      }
    }
  },
});