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
        console.error('Erro ao listar vendas:', error);

        return error;
      }
    },
    async getTotalSalesStatistics(queryParams:any) {
      try {
        const sales = await getTotalSalesStatistics(queryParams);
        
        return sales;
      } catch (error) {
        console.error('Erro ao listar estatísticas:', error);

        return error;
      }
    },
    async getTopSellerRanking(queryParams:any) {
      try {
        const sales = await getTopSellerRanking(queryParams);
        
        return sales;
      } catch (error) {
        console.error('Erro ao listar estatísticas:', error);

        return error;
      }
    },
    async getTopBuyingClients(queryParams:any) {
      try {
        const sales = await getTopBuyingClients(queryParams);
        
        return sales;
      } catch (error) {
        console.error('Erro ao listar estatísticas:', error);

        return error;
      }
    },
    async getTopSoldProducts(queryParams:any) {
      try {
        const sales = await getTopSoldProducts(queryParams);
        
        return sales;
      } catch (error) {
        console.error('Erro ao listar estatísticas:', error);

        return error;
      }
    },
    async getTopSoldCategories(queryParams:any) {
      try {
        const sales = await getTopSoldCategories(queryParams);
        
        return sales;
      } catch (error) {
        console.error('Erro ao listar estatísticas:', error);

        return error;
      }
    },
    async createSale(body:any) {
      try {
        const sales = await createSale(body);
        
        return sales;
      } catch (error) {
        console.error('Erro ao criar venda:', error);

        return error;
      }
    },
    async getSaleById(id:string) {
      try {
        const sale = await getSaleById(id);
        
        return sale;
      } catch (error) {
        console.error('Erro ao obter o venda com ID:', error);

        return error;
      }
    },
    async updateSale(id:string, body:any) {
      try {
        const sale = await updateSale(id, body);
        
        return sale;
      } catch (error) {
        console.error('Erro ao atualizar o venda:', error);

        return error;
      }
    },
    async deleteSale(id:string) {
      try {
        return await deleteSale(id);
      } catch (error) {
        return error;
      }
    },
    async getExportFile() {
      try {
        return await getExportFile();
      } catch (error) {
        return error;
      }
    }
  },
});