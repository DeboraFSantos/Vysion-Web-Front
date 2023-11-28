import BaseService from './base.service';

async function getPaymentMethods(queryParams?: Record<string, any>): Promise<any> {
    let endpoint = 'paymentMethods';

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

async function createPaymentMethod(body: any): Promise<any> {
    let endpoint = 'paymentMethods';

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

async function getPaymentMethodById(paymentMethodId: string): Promise<any> {
    let endpoint = `paymentMethods/${paymentMethodId}`;

    try {
        const response = await BaseService.fetchData(endpoint, {
            method: 'GET'
        });
        return response;
    } catch (error) {
        return undefined;
    }
}

async function updatePaymentMethod(paymentMethodId: string, body: any): Promise<any> {
    let endpoint = `paymentMethods/${paymentMethodId}`;

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

async function deletePaymentMethod(paymentMethodId: string): Promise<any> {
    let endpoint = `paymentMethods/${paymentMethodId}`;

    try {
        const response = await BaseService.fetchData(endpoint, {
            method: 'DELETE'
        });
        return response;
    } catch (error) {
        return undefined;
    }
}

export { getPaymentMethods, createPaymentMethod, getPaymentMethodById, updatePaymentMethod, deletePaymentMethod };
