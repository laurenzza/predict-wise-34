import { apiSalesSummary } from "@/api";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useDataSummary, useDataSummaryStore } from "./DataSummaryStore";

interface PaginationStore {
    current_page: number;
    limit: number;
    offset: number;
    rows_count: number;
    set_current_page: (current_page: number) => void;
    set_limit: (limit: number) => void;
}

export const usePaginationStore = create<PaginationStore>()(
    (set, get) => ({
        current_page: 1,
        limit: 10,
        offset: 0,
        rows_count: useDataSummaryStore.getState().data_summary?.total_transaksi || 0,
        set_current_page: (current_page) => {
            set({
                current_page: current_page
            });

            get().set_limit(get().limit);
        },
        set_limit: (limit) => {
            set({
                limit: limit,
                offset: (get().current_page - 1) * limit
            });
            
        }
    })
);

export const useCurrentPage = () => usePaginationStore((state) => (state.current_page));
export const useLimit = () => usePaginationStore((state) => (state.limit));
export const useOffset = () => usePaginationStore((state) => (state.offset));
export const useRowsCount = () => usePaginationStore((state) => (state.rows_count));
export const useSetCurrentPage = () => usePaginationStore((state) => (state.set_current_page));
export const useSetLimit = () => usePaginationStore((state) => (state.set_limit));