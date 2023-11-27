import { defineStore } from 'pinia';
import { getSellers, createSeller, getSellerById, updateSeller, deleteSeller, getSellerByEmail } from '@/services/sellers.service';

export const useSellerStore = defineStore({
  id: 'sellerStore',
  state: () => ({
    sellers: [],
  }),
  actions: {
    async getSellers(queryParams:any) {
      try {
        const sellers = await getSellers(queryParams);
        
        return sellers;
      } catch (error) {
        console.error('Erro ao listar vendedores:', error);
      }
    },
    async getSellerByEmail(queryParams:any) {
      try {
        const sellers = await getSellerByEmail(queryParams);
        
        return sellers;
      } catch (error) {
        console.error('Erro ao listar vendedores:', error);
      }
    },
    async createSeller(body:any) {
      try {
        const sellers = await createSeller(body);
        
        return sellers;
      } catch (error) {
        console.error('Erro ao criar vendedor:', error);

        return error;
      }
    },
    async getSellerById(id:string) {
      try {
        const seller = await getSellerById(id);
        
        return seller;
      } catch (error) {
        console.error('Erro ao obter o vendedor com ID:', error);

        return error;
      }
    },
    async updateSeller(id:string, body:any) {
      try {
        const seller = await updateSeller(id, body);
        
        return seller;
      } catch (error) {
        console.error('Erro ao atualizar o vendedor:', error);

        return error;
      }
    },
    async deleteSeller(id:string) {
      try {
        return await deleteSeller(id);
      } catch (error) {
        return error;
      }
    }
  },
});