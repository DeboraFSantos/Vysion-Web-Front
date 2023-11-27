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
        console.error('Erro ao listar clientes:', error);
      }
    },
    async createClient(body:any) {
      try {
        const clients = await createClient(body);
        
        return clients;
      } catch (error) {
        console.error('Erro ao criar cliente:', error);

        return error;
      }
    },
    async getClientById(id:string) {
      try {
        const client = await getClientById(id);
        
        return client;
      } catch (error) {
        console.error('Erro ao obter o cliente com ID:', error);

        return error;
      }
    },
    async updateClient(id:string, body:any) {
      try {
        const client = await updateClient(id, body);
        
        return client;
      } catch (error) {
        console.error('Erro ao atualizar o cliente:', error);

        return error;
      }
    },
    async deleteClient(id:string) {
      try {
        return await deleteClient(id);
      } catch (error) {
        return error;
      }
    }
  },
});