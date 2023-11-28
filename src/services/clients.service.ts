import BaseService from './base.service';

async function getClients(queryParams?: Record<string, any>): Promise<any> {
    let endpoint = 'clients';

    if (queryParams) {
        const queryString = new URLSearchParams(queryParams).toString();
        endpoint += `?${queryString}`;
    }

    try {
        const response = await BaseService.fetchData(endpoint, {
            method: 'GET'
        });
        return response;
    } catch (error) {
        return undefined;
    }
}

async function createClient(body: any): Promise<any> {
    let endpoint = 'clients';

    try {
        const response = await BaseService.fetchData(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
        return response;
    } catch (error) {
        return undefined;
    }
}

async function getClientById(clientId: string): Promise<any> {
    let endpoint = `clients/${clientId}`;

    try {
        const response = await BaseService.fetchData(endpoint, {
            method: 'GET'
        });
        return response;
    } catch (error) {
        return undefined;
    }
}

async function updateClient(clientId: string, body: any): Promise<any> {
    let endpoint = `clients/${clientId}`;

    try {
        const response = await BaseService.fetchData(endpoint, {
            method: 'PUT',
            body: body
        });
        return response;
    } catch (error) {
        return undefined;
    }
}

async function deleteClient(clientId: string): Promise<any> {
    let endpoint = `clients/${clientId}`;

    try {
        const response = await BaseService.fetchData(endpoint, {
            method: 'DELETE'
        });
        return response;
    } catch (error) {
        return undefined;
    }
}

export { getClients, createClient, getClientById, updateClient, deleteClient };
