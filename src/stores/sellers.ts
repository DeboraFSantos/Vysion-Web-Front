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
        return undefined;
      }
    },
    async getSellerByEmail(queryParams:any) {
      try {
        const sellers = await getSellerByEmail(queryParams);
        
        return sellers;
      } catch (error) {
        return undefined;
      }
    },
    async createSeller(body:any) {
      try {
        const sellers = await createSeller(body);
        
        return sellers;
      } catch (error) {
        return undefined;
      }
    },
    async getSellerById(id:string) {
      try {
        const seller = await getSellerById(id);
        
        return seller;
      } catch (error) {
        return undefined;
      }
    },
    async updateSeller(id:string, body:any) {
      try {
        const seller = await updateSeller(id, body);
        
        return seller;
      } catch (error) {
        return undefined;
      }
    },
    async deleteSeller(id:string) {
      try {
        return await deleteSeller(id);
      } catch (error) {
        return undefined;
      }
    }
  },
});