import { defineStore } from 'pinia';
import { getClients, createClient, getClientById, updateClient, deleteClient } from '@/services/clients.service';

export const useClientStore = defineStore({
  id: 'clientStore',
  state: () => ({
    clients: [],
  }),
  actions: {
    async getClients(queryParams:any) {
      try {
        const clients = await getClients(queryParams);
        
        return clients;
      } catch (error) {
        return undefined;
      }
    },
    async createClient(body:any) {
      try {
        const clients = await createClient(body);
        
        return clients;
      } catch (error) {
        return undefined;
      }
    },
    async getClientById(id:string) {
      try {
        const client = await getClientById(id);
        
        return client;
      } catch (error) {
        return undefined;
      }
    },
    async updateClient(id:string, body:any) {
      try {
        const client = await updateClient(id, body);
        
        return client;
      } catch (error) {
        return undefined;
      }
    },
    async deleteClient(id:string) {
      try {
        return await deleteClient(id);
      } catch (error) {
        return undefined;
      }
    }
  },
});