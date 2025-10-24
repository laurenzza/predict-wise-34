import { apiSalesSummary } from "@/api";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface DataSummary {
    total_transaksi: number;
    total_produk: number;
    periode_awal: Date;
    periode_akhir: Date;
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
    format_date: (date: Date) => string;
}

const useDataSummaryStore = create<DataSummaryStore>()(
    persist(
        (set,get) => ({
            data_summary: {
                total_transaksi: 0,
                total_produk: 0,
                periode_awal: new Date("2000-01-01T00:00:00.000Z"),
                periode_akhir: new Date("2000-01-01T00:00:00.000Z"),
                total_status_selesai: 0,
                total_status_dibatalkan: 0,
                total_status_dibatalkan_pembeli: 0,
                total_status_dibatalkan_penjual: 0,
                total_status_dibatalkan_sistem: 0,
                total_status_sedang_dikirim: 0,
            },
            summarize_data: async (user_id, access_token) => {
                const response = await apiSalesSummary(user_id, access_token);

                response.periode_awal = new Date(response.periode_awal);
                response.periode_akhir = new Date(response.periode_akhir);

                set({ data_summary: response });
            },
            format_date: (date) => {
                console.log(date.toLocaleString('id-ID', {month: "short", year: "numeric"}));
                return date.toLocaleString('id-ID', {month: "short", year: "numeric"});
            }
        }),
        {
            name: "data_summary",
        }
    )
);

export const useDataSummary = () => useDataSummaryStore((state) => state.data_summary);
export const useSummarizeData = () => useDataSummaryStore((state) => state.summarize_data);
export const useFormatDate = () => useDataSummaryStore((state) => state.format_date);