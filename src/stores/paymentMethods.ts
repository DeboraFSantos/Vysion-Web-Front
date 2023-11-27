import { defineStore } from 'pinia';
import { getPaymentMethods, createPaymentMethod, getPaymentMethodById, updatePaymentMethod, deletePaymentMethod } from '@/services/paymentMethods.service';

export const usePaymentMethodStore = defineStore({
  id: 'paymentMethodStore',
  state: () => ({
    paymentMethods: [],
  }),
  actions: {
    async getPaymentMethods(queryParams:any) {
      try {
        const paymentMethods = await getPaymentMethods(queryParams);
        
        return paymentMethods;
      } catch (error) {
        console.error('Erro ao listar paymentMethodes:', error);
      }
    },
    async createPaymentMethod(body:any) {
      try {
        const paymentMethods = await createPaymentMethod(body);
        
        return paymentMethods;
      } catch (error) {
        console.error('Erro ao criar paymentMethode:', error);

        return error;
      }
    },
    async getPaymentMethodById(id:string) {
      try {
        const paymentMethod = await getPaymentMethodById(id);
        
        return paymentMethod;
      } catch (error) {
        console.error('Erro ao obter o paymentMethode com ID:', error);

        return error;
      }
    },
    async updatePaymentMethod(id:string, body:any) {
      try {
        const paymentMethod = await updatePaymentMethod(id, body);
        
        return paymentMethod;
      } catch (error) {
        console.error('Erro ao atualizar o paymentMethode:', error);

        return error;
      }
    },
    async deletePaymentMethod(id:string) {
      try {
        return await deletePaymentMethod(id);
      } catch (error) {
        return error;
      }
    }
  },
});