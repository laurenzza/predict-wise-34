import { apiSalesSummary } from "@/api";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface DataSummary {
    total_transaksi: number;
    total_produk: number;
    periode_awal: string;
    periode_akhir: string;
    total_status_selesai: number;
    total_status_dibatalkan: number;
    total_status_dibatalkan_pembeli: number;
    total_status_dibatalkan_penjual: number;
    total_status_dibatalkan_sistem: number;
    total_status_sedang_dikirim: number;
}

interface DataSummaryStore {
    data_summary: DataSummary;
    summarize_data: (user_id: number, access_token: string) => Promise<void>;
    format_date: (date: string) => string;
    reset: () => void;
}

export const useDataSummaryStore = create<DataSummaryStore>()(
    persist(
        (set,get) => ({
            data_summary: null,
            summarize_data: async (user_id, access_token) => {
                const response = await apiSalesSummary(user_id, access_token);

                set({ data_summary: response });
            },
            format_date: (date) => {
                const new_date = new Date(date);
                // console.log(new_date.toLocaleString('id-ID', {month: "short", year: "numeric"}));
                return new_date.toLocaleString('id-ID', {month: "short", year: "numeric"});
            },
            reset: () => {
                set({ data_summary: null });
            }
        }),
        {
            name: "data_summary",
        }
    )
);

export const useReset = () => useDataSummaryStore((state) => state.reset);
export const useDataSummary = () => useDataSummaryStore((state) => state.data_summary);
export const useSummarizeData = () => useDataSummaryStore((state) => state.summarize_data);
export const useFormatDate = () => useDataSummaryStore((state) => state.format_date);