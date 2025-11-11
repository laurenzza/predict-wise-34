import { DailyPredictions, MonthlyPredictions, PredictionComparisons, PredictionMetrics, TotalPredictions, WeeklyPredictions } from '@/hooks/usePredictions';
import { Product } from '@/hooks/useProducts';
import { SalesTrend, TemporalPattern, TransactionAnalysis } from '@/hooks/useSalesTrend';
import { TopProducts, TopProductsSummary } from '@/hooks/useTopProducts';
import { useAuthStore, User } from '@/store/AuthStore';
import { DataSummary, useSummarizeData } from '@/store/DataSummaryStore';
import { usePaginationStore } from '@/store/PaginationStore';
import { SalesData } from '@/store/SalesDataStore';
import axios from 'axios';

const base_url = "http://localhost:8000"

export const apiLogin = async (email: string, password: string): Promise<any> => {
    try {
        const token = await axios.post(`${base_url}/token`,
            {
                username: email,
                password: password
            },
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        )

        const user = await axios.get(`${base_url}/api/user/me`,
            {
                headers: {
                    "Authorization": `Bearer ${token.data.access_token}`
                }
            }
        )
        return {
            "user_data": user.data,
            "access_token": token.data.access_token
        };
    } catch (error) {
        throw error;
    }
}

export const apiRegister = async (email: string, nama_lengkap: string, password: string, role: string): Promise<any> => {
    try {
        const response = await axios.post(`${base_url}/api/user/register`,
            {
                email: email,
                nama_lengkap: nama_lengkap,
                password: password,
                role: role
            }
        );

        return await apiLogin(email, password);
    } catch (error) {
        throw error;
    }
}

export const apiEditProfile = async (user_id: number, email: string, nama_lengkap: string, nama_toko: string, role: string, access_token: string): Promise<User> => {
    try {
        const response = await axios.put(`${base_url}/api/user/edit_profile`,
            {
                user_id: user_id,
                email: email,
                nama_lengkap: nama_lengkap,
                nama_toko: nama_toko,
                role: role,
            },
            {
                headers: {
                    "Authorization": `Bearer ${access_token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        throw error;
    }
}

export const apiChangePassword = async (user_id: number, email: string, old_password: string, new_password: string, access_token: string): Promise<User> => {
    try {
        const response = await axios.put(`${base_url}/api/user/change_password`,
            {
                user_id: user_id,
                email: email,
                password: old_password,
                new_password: new_password
            },
            {
                headers: {
                    "Authorization": `Bearer ${access_token}`
                }
            }
        )

        return response.data;
    } catch (error) {
        throw error;
    }
}

export const apiDeleteAccount = async (user_id: number, access_token: string): Promise<any> => {
    try {
        const response = await axios.delete(`${base_url}/api/user/${user_id}/delete`,
            {
                headers: {
                    "Authorization": `Bearer ${access_token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        throw error;
    }
}

export const apiUploadSales = async (file: FormData): Promise<User> => {
    const auth = useAuthStore.getState()
    try {
        const response = await axios.post(`${base_url}/api/sales/upload`,
            file,
            {
                headers: {
                    "Authorization": `Bearer ${auth.access_token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        throw error;
    }
}

export const apiSalesSummary = async (user_id: number, access_token: string): Promise<DataSummary | null> => {
    try {
        const response = await axios.get(`${base_url}/api/sales/summary/${user_id}`,
            {
                headers: {
                    "Authorization": `Bearer ${access_token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        throw error;
    }
}

export const apiFetchSales = async (limit: number, offset: number, year: string, status: string): Promise<any> => {
    try {
        const auth = useAuthStore.getState();
        const response = await axios.get(`${base_url}/api/sales/${auth.user_id}`,
            {
                params: {
                    limit: limit,
                    offset: offset,
                    year: year,
                    status: status,
                },
                headers: {
                    "Authorization": `Bearer ${auth.access_token}`
                }
            }
        );

        usePaginationStore.setState({ rows_count: response.data.rows });

        return response.data;
    } catch (error) {
        throw error;
    }
}

export const apiFetchProducts = async (limit: number, offset: number): Promise<Product[]> => {
    try {
        const auth = useAuthStore.getState();

        const response = await axios(`${base_url}/api/sales/products/${auth.user_id}`,
            {
                params: {
                    limit: limit,
                    offset: offset,
                },
                headers: {
                    "Authorization": `Bearer ${auth.access_token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        throw error;
    }
}

export const apiFetchTopProductsSummary = async (): Promise<TopProductsSummary> => {
    try {
        const auth = useAuthStore.getState();

        const response = await axios.get(`${base_url}/api/top_products/summary/${auth.user_id}`,
            {
                headers: {
                    "Authorization": `Bearer ${auth.access_token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        throw error;
    }
}

export const apiFetchTopProducts = async (): Promise<TopProducts[]> => {
    try {
        const auth = useAuthStore.getState();

        const response = await axios.get(`${base_url}/api/top_products/${auth.user_id}`,
            {
                headers: {
                    "Authorization": `Bearer ${auth.access_token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        throw error;
    }
}

export const apiFetchMonthlySalesTrend = async (): Promise<SalesTrend[]> => {
    try {
        const auth = useAuthStore.getState();

        const response = await axios.get(`${base_url}/api/statistics/monthly_trend/${auth.user_id}`,
            {
                headers: {
                    "Authorization" : `Bearer ${auth.access_token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        throw error;
    }
}

export const apiFetchTransactionAnalysis = async (): Promise<TransactionAnalysis> => {
    try {
        const auth = useAuthStore.getState();

        const response = await axios.get(`${base_url}/api/statistics/transaction_analysis/${auth.user_id}`,
            {
                headers: {
                    "Authorization" : `Bearer ${auth.access_token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        throw error;
    }
}

export const apiFetchTemporalPattern = async (): Promise<TemporalPattern> => {
    try {
        const auth = useAuthStore.getState();

        const response = await axios.get(`${base_url}/api/statistics/temporal_pattern/${auth.user_id}`,
            {
                headers: {
                    "Authorization" : `Bearer ${auth.access_token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        throw error;
    }
}

export const apiFetchPredictionMetrics = async (): Promise<PredictionMetrics> => {
    try {
        const auth = useAuthStore.getState();
        const response = await axios.get(`${base_url}/api/predictions/metrics/${auth.user_id}`,
            {
                headers: {
                    "Authorization" : `Bearer ${auth.access_token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        throw error;
    }
}

export const apiRunPrediction = async (): Promise<any> => {
    try {
        const auth = useAuthStore.getState();
        const response = await axios.post(`${base_url}/api/predictions/predict`,
            {
                user_id: auth.user_id,
                csv_path: auth.csv_path
            },
            {
                headers: {
                    "Authorization" : `Bearer ${auth.access_token}`
                }
            }
        );
    
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const apiFetchPredictionComparisons = async (): Promise<PredictionComparisons> => {
    try {
        const auth = useAuthStore.getState();
        const response = await axios.get(`${base_url}/api/predictions/comparisons/${auth.user_id}`,
            {
                headers: {
                    "Authorization" : `Bearer ${auth.access_token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        throw error;
    }
}

export const apiFetchTotalPredictions = async (): Promise<TotalPredictions> => {
    try {
        const auth = useAuthStore.getState();
        const response = await axios.get(`${base_url}/api/predictions/total/${auth.user_id}`,
            {
                headers: {
                    "Authorization" : `Bearer ${auth.access_token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        throw error;
    }
}

export const apiFetchDailyPredictions = async (): Promise<DailyPredictions> => {
    try {
        const auth = useAuthStore.getState();
        const response = await axios.get(`${base_url}/api/predictions/daily/${auth.user_id}`,
            {
                headers: {
                    "Authorization" : `Bearer ${auth.access_token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        throw error;
    }
}

export const apiFetchWeeklyPredictions = async (): Promise<WeeklyPredictions> => {
    try {
        const auth = useAuthStore.getState();
        const response = await axios.get(`${base_url}/api/predictions/weekly/${auth.user_id}`,
            {
                headers: {
                    "Authorization" : `Bearer ${auth.access_token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        throw error;
    }
}

export const apiFetchMonthlyPredictions = async (): Promise<MonthlyPredictions> => {
    try {
        const auth = useAuthStore.getState();
        const response = await axios.get(`${base_url}/api/predictions/monthly/${auth.user_id}`,
            {
                headers: {
                    "Authorization" : `Bearer ${auth.access_token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        throw error;
    }
}