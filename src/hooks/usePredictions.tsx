import { apiCompare, apiCompareMonths, apiFetchTop10NextMonth, apiFetchDailyPredictions, apiFetchMonthlyPredictions, apiFetchPredictionComparisons, apiFetchPredictionMetrics, apiFetchTotalPredictions, apiFetchWeeklyPredictions, apiPredictSevenDays, apiPredictSingleDay, apiRunPrediction } from "@/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

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
        queryKey: ["predictions","prediction_metrics"],
        queryFn: () => apiFetchPredictionMetrics()
    })
}

export const usePredictionComparisons = () => {
    return useQuery({
        queryKey: ["predictions","prediction_comparisons"],
        queryFn: () => apiFetchPredictionComparisons()
    })
}

export const useTotalPredictions = () => {
    return useQuery({
        queryKey: ["predictions","total_predictions"],
        queryFn: () => apiFetchTotalPredictions()
    })
}

export const useDailyPredictions = () => {
    return useQuery({
        queryKey: ["predictions","daily_predictions"],
        queryFn: () => apiFetchDailyPredictions()
    })
}

export const useWeeklyPredictions = () => {
    return useQuery({
        queryKey: ["predictions","weekly_predictions"],
        queryFn: () => apiFetchWeeklyPredictions()
    })
}

export const useMonthlyPredictions = () => {
    return useQuery({
        queryKey: ["predictions","monthly_predictions"],
        queryFn: () => apiFetchMonthlyPredictions()
    })
}

export const useSingleDayPrediction = (date: string) => {
    return useQuery({
        queryKey: ["predictions","single_day_prediction", date],
        queryFn: () => apiPredictSingleDay(date)
    })
}

export const useSevenDaysPrediction = (date: string) => {
    return useQuery({
        queryKey: ["predictions","seven_days_prediction", date],
        queryFn: () => apiPredictSevenDays(date)
    })
}

export const useCompare = () => {
    return useQuery({
        queryKey: ["predictions","compare_predictions"],
        queryFn: () => apiCompare()
    })
}

export const useCompareMonths = () => {
    return useQuery({
        queryKey: ["predictions","compare_predictions_months"],
        queryFn: () => apiCompareMonths()
    })
}

export const useTop10NextMonth = () => {
    return useQuery({
        queryKey: ["predictions","top_10_next_month"],
        queryFn: () => apiFetchTop10NextMonth()
    })
}

export const useRunPrediction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // 1. The function that actually makes the API call
    mutationFn: () => apiRunPrediction(),
    
    // 2. What happens AFTER a successful call
    onSuccess: () => {
      // Because we used hierarchical keys (starting with "predictions"),
      // this one line forces all related queries to refetch!
      queryClient.invalidateQueries({ queryKey: ["predictions"] });
    },
    
    // Optional: What happens if it fails
    onError: (error) => {
      console.error("Failed to run prediction:", error);
      // You could trigger a toast notification here
    }
  });
};