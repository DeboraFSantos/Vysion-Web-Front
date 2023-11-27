import BaseService from './base.service';

async function getCategories(queryParams?: Record<string, any>): Promise<any> {
    let endpoint = 'categories';

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

async function createCategory(body: any): Promise<any> {
    let endpoint = 'categories';

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

async function getCategoryById(categoryId: string): Promise<any> {
    let endpoint = `categories/${categoryId}`;

    try {
        const response = await BaseService.fetchData(endpoint, {
            method: 'GET'
        });
        return response;
    } catch (error) {
        throw error;
    }
}

async function updateCategory(categoryId: string, body: any): Promise<any> {
    let endpoint = `categories/${categoryId}`;

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

async function deleteCategory(categoryId: string): Promise<any> {
    let endpoint = `categories/${categoryId}`;

    try {
        const response = await BaseService.fetchData(endpoint, {
            method: 'DELETE'
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export { getCategories, createCategory, getCategoryById, updateCategory, deleteCategory };
