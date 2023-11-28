import { defineStore } from 'pinia';
import { getSales, createSale, getSaleById, updateSale, deleteSale, getExportFile, getTotalSalesStatistics, getTopSoldCategories, getTopSoldProducts, getTopBuyingClients, getTopSellerRanking } from '@/services/sales.service';

export const useSaleStore = defineStore({
  id: 'saleStore',
  state: () => ({
    sales: [],
  }),
  actions: {
    async getSales(queryParams:any) {
      try {
        const sales = await getSales(queryParams);
        
        return sales;
      } catch (error) {
        return undefined;
      }
    },
    async getTotalSalesStatistics(queryParams:any) {
      try {
        const sales = await getTotalSalesStatistics(queryParams);
        
        return sales;
      } catch (error) {
        return undefined;
      }
    },
    async getTopSellerRanking(queryParams:any) {
      try {
        const sales = await getTopSellerRanking(queryParams);
        
        return sales;
      } catch (error) {
        return undefined;
      }
    },
    async getTopBuyingClients(queryParams:any) {
      try {
        const sales = await getTopBuyingClients(queryParams);
        
        return sales;
      } catch (error) {
        return undefined;
      }
    },
    async getTopSoldProducts(queryParams:any) {
      try {
        const sales = await getTopSoldProducts(queryParams);
        
        return sales;
      } catch (error) {
        return undefined;
      }
    },
    async getTopSoldCategories(queryParams:any) {
      try {
        const sales = await getTopSoldCategories(queryParams);
        
        return sales;
      } catch (error) {
        return undefined;
      }
    },
    async createSale(body:any) {
      try {
        const sales = await createSale(body);
        
        return sales;
      } catch (error) {
        return undefined;
      }
    },
    async getSaleById(id:string) {
      try {
        const sale = await getSaleById(id);
        
        return sale;
      } catch (error) {
        return undefined;
      }
    },
    async updateSale(id:string, body:any) {
      try {
        const sale = await updateSale(id, body);
        
        return sale;
      } catch (error) {
        return undefined;
      }
    },
    async deleteSale(id:string) {
      try {
        return await deleteSale(id);
      } catch (error) {
        return undefined;
      }
    },
    async getExportFile() {
      try {
        return await getExportFile();
      } catch (error) {
        return undefined;
      }
    }
  },
});