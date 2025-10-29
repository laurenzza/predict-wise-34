import { apiChangePassword, apiDeleteAccount, apiEditProfile, apiLogin, apiRegister, apiSalesSummary } from '@/api';
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useDataSummaryStore, useSummarizeData } from './DataSummaryStore';

export interface User {
    user_id: number;
    email: string;
    nama_lengkap: string;
    nama_toko: string;
    role: string;
}

interface AuthStore {
    user_id: number;
    email: string;
    nama_lengkap: string;
    nama_toko: string;
    role: string;
    access_token: string;
    login: (email: string, password: string) => Promise<User>;
    register: (email: string, nama_lengkap: string, password: string, role: string) => Promise<User>;
    logout: () => void;
    edit_profile: (email: string, nama_lengkap: string, nama_toko: string, role: string) => Promise<User>;
    change_password: (old_password: string, new_password: string) => Promise<User>;
    delete_account: () => Promise<any>;
    is_authenticated: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user_id: 0,
            email: "",
            nama_lengkap: "",
            nama_toko: "",
            role: "",
            access_token: "",
            login: async (email, password) => {
                const response = await apiLogin(email, password);

                set({
                    user_id: response.user_data.user_id,
                    email: response.user_data.email,
                    nama_lengkap: response.user_data.nama_lengkap,
                    nama_toko: response.user_data.nama_toko,
                    role: response.user_data.role,
                    access_token: response.access_token
                });

                if(useDataSummaryStore.getState().data_summary?.total_transaksi != null){
                    const summarize_data = useDataSummaryStore.getState().summarize_data;
                    await summarize_data(get().user_id, get().access_token);
                }

                return response.user_data;
            },
            register: async (email, nama_lengkap, password, role) => {
                const response = await apiRegister(email, nama_lengkap, password, role);
                set({
                    user_id: response.user_data.user_id,
                    email: response.user_data.email,
                    nama_lengkap: response.user_data.nama_lengkap,
                    nama_toko: response.user_data.nama_toko,
                    role: response.user_data.role,
                    access_token: response.access_token
                });
                return response.user_data;
            },
            logout: () => {
                set({
                    user_id: 0,
                    email: "",
                    nama_lengkap: "",
                    nama_toko: "",
                    role: "",
                    access_token: "",
                });

                useDataSummaryStore.getState().reset();
                localStorage.clear();
            },
            edit_profile: async (email, nama_lengkap, nama_toko, role) => {
                const response = await apiEditProfile(get().user_id, email, nama_lengkap, nama_toko, role, get().access_token);
                set({
                    email: response.email,
                    nama_lengkap: response.nama_lengkap,
                    nama_toko: response.nama_toko,
                    role: response.role,
                });
                return response;
            },
            change_password: async (old_password, new_password) => {
                const response = await apiChangePassword(get().user_id, get().email, old_password, new_password, get().access_token);
                return response;
            },
            delete_account: async () => {
                const response = await apiDeleteAccount(get().user_id, get().access_token);
                get().logout();
                return response;
            },
            is_authenticated: () => {
                return get().access_token != "";
            }
        }),
        {
            name: 'auth',
        }
    )
);

export const useAuthId = () => useAuthStore((state) => state.user_id);
export const useAuthEmail = () => useAuthStore((state) => state.email);
export const useAuthNamaLengkap = () => useAuthStore((state) => state.nama_lengkap);
export const useAuthNamaToko = () => useAuthStore((state) => state.nama_toko);
export const useAuthRole = () => useAuthStore((state) => state.role);
export const useAuthToken = () => useAuthStore((state) => state.access_token);
export const useAuthLogin = () => useAuthStore((state) => state.login);
export const useAuthRegister = () => useAuthStore((state) => state.register);
export const useAuthLogout = () => useAuthStore((state) => state.logout);
export const useAuthEditProfile = () => useAuthStore((state) => state.edit_profile);
export const useAuthChangePassword = () => useAuthStore((state) => state.change_password);
export const useAuthDeleteAccount = () => useAuthStore((state) => state.delete_account);
export const useAuthIsAuthenticated = () => useAuthStore((state) => state.is_authenticated);