import BaseService from './base.service';

async function getProducts(queryParams?: Record<string, any>): Promise<any> {
    let endpoint = 'products';

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

async function createProduct(body: any): Promise<any> {
    let endpoint = 'products';

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

async function getProductById(productId: string): Promise<any> {
    let endpoint = `products/${productId}`;

    try {
        const response = await BaseService.fetchData(endpoint, {
            method: 'GET'
        });
        return response;
    } catch (error) {
        throw error;
    }
}

async function updateProduct(productId: string, body: any): Promise<any> {
    let endpoint = `products/${productId}`;

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

async function deleteProduct(productId: string): Promise<any> {
    let endpoint = `products/${productId}`;

    try {
        const response = await BaseService.fetchData(endpoint, {
            method: 'DELETE'
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export { getProducts, createProduct, getProductById, updateProduct, deleteProduct };
