import { apiFetchMonthlySalesTrend, apiFetchTemporalPattern, apiFetchTransactionAnalysis } from "@/api"
import { useQuery } from "@tanstack/react-query"

export interface SalesTrend {
    bulan_pembayaran: number;
    tahun_pembayaran: number;
    total_penjualan: number;
    pertumbuhan: number;
}

export interface TransactionAnalysis {
    avg_penjualan: number;
    max_penjualan: number;
    min_penjualan: number;
    median_penjualan: number;
    std_penjualan: number;
}

export interface TemporalPattern {
    hari_transaksi: number;
    jumlah_transaksi_hari: number;
    bulan_transaksi: number;
    jumlah_transaksi_bulan: number;
    rentang_jam_transaksi: string;
    jumlah_transaksi_jam: number;
}

export const useSalesTrend = () => {
    return useQuery({
        queryKey: ["sales_trend"],
        queryFn: () => apiFetchMonthlySalesTrend()
    })
}

export const useTransactionAnalysis = () => {
    return useQuery({
        queryKey: ["transaction_analysis"],
        queryFn: () => apiFetchTransactionAnalysis()
    })
}

export const useTemporalPattern = () => {
    return useQuery({
        queryKey: ["tempora_pattern"],
        queryFn: () => apiFetchTemporalPattern()
    })
}