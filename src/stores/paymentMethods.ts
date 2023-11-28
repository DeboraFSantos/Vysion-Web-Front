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
        return undefined;
      }
    },
    async createPaymentMethod(body:any) {
      try {
        const paymentMethods = await createPaymentMethod(body);
        
        return paymentMethods;
      } catch (error) {
        return undefined;
      }
    },
    async getPaymentMethodById(id:string) {
      try {
        const paymentMethod = await getPaymentMethodById(id);
        
        return paymentMethod;
      } catch (error) {
        return undefined;
      }
    },
    async updatePaymentMethod(id:string, body:any) {
      try {
        const paymentMethod = await updatePaymentMethod(id, body);
        
        return paymentMethod;
      } catch (error) {
        return undefined;
      }
    },
    async deletePaymentMethod(id:string) {
      try {
        return await deletePaymentMethod(id);
      } catch (error) {
        return undefined;
      }
    }
  },
});