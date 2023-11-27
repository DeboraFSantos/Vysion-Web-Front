import BaseService from './base.service';

async function getSales(queryParams?: Record<string, any>): Promise<any> {
    let endpoint = 'sales';

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

async function getTotalSalesStatistics(queryParams?: Record<string, any>): Promise<any> {
    let endpoint = 'sales/totalSalesStatistics';

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

async function getTopSellerRanking(queryParams?: Record<string, any>): Promise<any> {
    let endpoint = 'sales/topSellerRanking';

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

async function getTopBuyingClients(queryParams?: Record<string, any>): Promise<any> {
    let endpoint = 'sales/topBuyingClients';

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

async function getTopSoldProducts(queryParams?: Record<string, any>): Promise<any> {
    let endpoint = 'sales/topSoldProducts';

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

async function getTopSoldCategories(queryParams?: Record<string, any>): Promise<any> {
    let endpoint = 'sales/topSoldCategories';

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

async function createSale(body: any): Promise<any> {
    let endpoint = 'sales';

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

async function getSaleById(saleId: string): Promise<any> {
    let endpoint = `sales/${saleId}`;

    try {
        const response = await BaseService.fetchData(endpoint, {
            method: 'GET'
        });
        return response;
    } catch (error) {
        throw error;
    }
}

async function updateSale(saleId: string, body: any): Promise<any> {
    let endpoint = `sales/${saleId}`;

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

async function deleteSale(saleId: string): Promise<any> {
    let endpoint = `sales/${saleId}`;

    try {
        const response = await BaseService.fetchData(endpoint, {
            method: 'DELETE'
        });
        return response;
    } catch (error) {
        throw error;
    }
}

async function getExportFile(): Promise<any> {
    let endpoint = `sales/export`;

    try {
        const response = await BaseService.fetchData(endpoint, {
            method: 'GET'
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export { getSales, createSale, getSaleById, updateSale, deleteSale, getExportFile, getTotalSalesStatistics, getTopSellerRanking, getTopBuyingClients, getTopSoldProducts, getTopSoldCategories };
