import { apiFetchProducts } from "@/api";
import { useQuery } from "@tanstack/react-query"

export interface Product {
    nomor_produk: number;
    nama_produk: string;
    total_transaksi: number;
    total_penjualan: number;
}

export const useProducts = (limit: number, offset: number) => {
    return useQuery({
        queryKey: ["products", limit, offset],
        queryFn: () => apiFetchProducts(limit, offset),
    })
}