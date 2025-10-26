import { apiFetchTopProducts, apiFetchTopProductsSummary } from "@/api";
import { useQuery } from "@tanstack/react-query";

export interface TopProductsSummary {
    total_penjualan_top: number,
    total_unit_terjual_top: number,
}

export interface TopProducts {
    nama_produk: string,
    total_unit_terjual: number,
    total_transaksi: number,
    total_penjualan: number,
}

export const useTopProducts = () => {
    return useQuery({
        queryKey: ["top_products"],
        queryFn: () => apiFetchTopProducts()
    });
}

export const useTopProductsSummary = () => {
    return useQuery({
        queryKey: ["top_products_summary"],
        queryFn: () => apiFetchTopProductsSummary()
    })
}