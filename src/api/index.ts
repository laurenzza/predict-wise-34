import { User } from '@/store/AuthStore';
import { DataSummary, useSummarizeData } from '@/store/DataSummaryStore';
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

export const apiUploadSales = async (file: FormData, access_token: string): Promise<any> => {
    try {
        const response = await axios.post(`${base_url}/api/sales/upload`,
            file,
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

export const apiSalesSummary = async (user_id: number, access_token: string): Promise<DataSummary> => {
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