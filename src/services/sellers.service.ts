import BaseService from './base.service';

async function getSellers(queryParams?: Record<string, any>): Promise<any> {
    let endpoint = 'users';

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
        throw error;
    }
}

async function createSeller(body: any): Promise<any> {
    let endpoint = 'users';

    try {
        const response = await BaseService.fetchData(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
        return response;
    } catch (error) {
        throw error;
    }
}

async function getSellerById(sellerId: string): Promise<any> {
    let endpoint = `users/${sellerId}`;

    try {
        const response = await BaseService.fetchData(endpoint, {
            method: 'GET'
        });
        return response;
    } catch (error) {
        throw error;
    }
}

async function getSellerByEmail(queryParams?: Record<string, any>): Promise<any> {
    let endpoint = 'users/email';

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
        throw error;
    }
}

async function updateSeller(sellerId: string, body: any): Promise<any> {
    let endpoint = `users/${sellerId}`;

    try {
        const response = await BaseService.fetchData(endpoint, {
            method: 'PUT',
            body: body
        });
        return response;
    } catch (error) {
        throw error;
    }
}

async function deleteSeller(sellerId: string): Promise<any> {
    let endpoint = `users/${sellerId}`;

    try {
        const response = await BaseService.fetchData(endpoint, {
            method: 'DELETE'
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export { getSellers, createSeller, getSellerById, updateSeller, deleteSeller, getSellerByEmail };
