// @ts-ignore
import { getAuth } from 'firebase/auth';

class BaseService {
    private get api(): string {
        // @ts-ignore
        return import.meta.env.VITE_BASE_URL as string;
    }

    public async fetchData(endpoint: string, options: Record<string, any> = {}): Promise<any> {
        try {
            const token = localStorage.getItem('token');
            const headers: Record<string, string> = {
                'Content-Type': 'application/json'
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${this.api}/${endpoint}`, {
                headers,
                ...options,
            });

            if (!response.ok) {
                if (response.status === 401) {
                    await this.refreshToken();
                    return this.fetchData(endpoint, options);
                }
                throw new Error('Erro ao consumir a API');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro na requisição:', error);
            throw error;
        }
    }

    private async refreshToken(): Promise<void> {
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                throw new Error('Usuário não autenticado.');
            }

            const accessToken: string = await user.getIdToken(/* forceRefresh = */ true);
            localStorage.setItem('token', accessToken);
        } catch (error) {
            console.error('Erro ao renovar o token:', error);
            throw error;
        }
    }
}

export default new BaseService();
