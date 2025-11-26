import { apiCompare, apiFetchDailyPredictions, apiFetchMonthlyPredictions, apiFetchPredictionComparisons, apiFetchPredictionMetrics, apiFetchTotalPredictions, apiFetchWeeklyPredictions, apiPredictSevenDays, apiPredictSingleDay } from "@/api"
import { useQuery } from "@tanstack/react-query"

interface PredictionMetricsBase {
    prediction_metric_id: number
    arima_mae: number
    arima_rmse: number
    arima_waktu_train: number
    arima_memori: number
    lstm_mae: number
    lstm_rmse: number
    lstm_waktu_train: number
    lstm_memori: number
}

export interface PredictionMetrics {
    data: PredictionMetricsBase
    job_status: string
}

export interface PredictionComparisonBase {
    total_prediction_id: number
    hari: number
    hasil_total_penjualan_aktual: number
    hasil_total_penjualan_arima: number
    hasil_total_penjualan_lstm: number
}

export interface PredictionComparisons {
    data: PredictionComparisonBase[]
    job_status: string
}

export interface TotalBase {
    total_prediction_id: number
    hasil_tanggal: Date
    hasil_total_penjualan_arima: number
    hasil_total_penjualan_lstm: number
}

export interface DailyBase {
    daily_product_prediction_id: number
    hasil_nama_produk_arima: string
    hasil_nama_produk_lstm: string
    hari: number
}

export interface WeeklyBase {
    weekly_product_prediction_id: number
    hasil_nama_produk_arima: string
    hasil_nama_produk_lstm: string
    minggu: number
}

export interface MonthlyBase {
    monthly_product_prediction_id: number
    hasil_nama_produk_arima: string
    hasil_nama_produk_lstm: string
    bulan: number
}

export interface TotalPredictions {
    data?: TotalBase[]
    job_status: string
}

export interface DailyPredictions {
    data?: DailyBase[]
    job_status: string
}

export interface WeeklyPredictions {
    data?: WeeklyBase[]
    job_status: string
}

export interface MonthlyPredictions {
    data?: MonthlyBase[]
    job_status: string
}

export const usePredictionMetrics = () => {
    return useQuery({
        queryKey: ["prediction_metrics"],
        queryFn: () => apiFetchPredictionMetrics()
    })
}

export const usePredictionComparisons = () => {
    return useQuery({
        queryKey: ["prediction_comparisons"],
        queryFn: () => apiFetchPredictionComparisons()
    })
}

export const useTotalPredictions = () => {
    return useQuery({
        queryKey: ["total_predictions"],
        queryFn: () => apiFetchTotalPredictions()
    })
}

export const useDailyPredictions = () => {
    return useQuery({
        queryKey: ["daily_predictions"],
        queryFn: () => apiFetchDailyPredictions()
    })
}

export const useWeeklyPredictions = () => {
    return useQuery({
        queryKey: ["weekly_predictions"],
        queryFn: () => apiFetchWeeklyPredictions()
    })
}

export const useMonthlyPredictions = () => {
    return useQuery({
        queryKey: ["monthly_predictions"],
        queryFn: () => apiFetchMonthlyPredictions()
    })
}

export const useSingleDayPrediction = (date: string) => {
    return useQuery({
        queryKey: ["single_day_prediction", date],
        queryFn: () => apiPredictSingleDay(date)
    })
}

export const useSevenDaysPrediction = (date: string) => {
    return useQuery({
        queryKey: ["seven_days_prediction", date],
        queryFn: () => apiPredictSevenDays(date)
    })
}

export const useCompare = () => {
    return useQuery({
        queryKey: ["compare_predictions"],
        queryFn: () => apiCompare()
    })
}