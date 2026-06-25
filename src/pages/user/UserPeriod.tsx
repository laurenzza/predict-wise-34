import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Hourglass, CircleX, TrendingUp, Package, LayoutList } from "lucide-react";
import { useTop10NextMonth } from "@/hooks/usePredictions";
import { useNavigate } from "react-router-dom";
import { Top10PredictionChart } from "@/components/charts/ProductPredictionChart";

// ============================================================================
// 3. HALAMAN UTAMA (USER PERIOD)
// ============================================================================
export const UserPeriod = () => {
  const navigate = useNavigate();

  const { data: responseData, isLoading, error } = useTop10NextMonth();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8 max-w-7xl flex flex-col flex-grow">
        {/* Header (Judul Utama) */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Dashboard
          </Button>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Prediksi <span className="bg-gradient-ml bg-clip-text text-transparent">Penjualan Bulanan</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            {isLoading 
              ? "Menyiapkan prediksi untuk bulan berikutnya..." 
              : `Hasil kalkulasi prediksi penjualan untuk ${responseData?.target_month || "Bulan Depan"}`}
          </p>
        </div>

        {/* State Loading & Error */}
        {isLoading ? (
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center p-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <Hourglass className="h-10 w-10 text-ml-primary mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-1">Memuat Prediksi...</h3>
              <p className="text-sm text-slate-500">Menghitung alokasi hasil ensemble ARIMA & LSTM...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center p-8 bg-red-50/50 dark:bg-red-950/20 backdrop-blur-sm rounded-xl border border-red-100 dark:border-red-900 shadow-sm max-w-md">
              <CircleX className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">Gagal Memuat Data</h3>
              <p className="text-sm text-red-600 dark:text-red-300">{error instanceof Error ? error.message : "Terjadi kesalahan sistem."}</p>
              <Button variant="outline" className="mt-6 border-red-200 text-red-600 hover:bg-red-50" onClick={() => window.location.reload()}>
                Coba Lagi
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full animate-in fade-in duration-500 space-y-6">
            
            {/* 1. Header Nama Bulan & Estimasi Total Pendapatan */}
            <div className="p-6 md:p-8 bg-gradient-to-br from-ml-primary/10 to-ml-accent/10 rounded-xl border border-ml-primary/20 flex flex-col items-center justify-center text-center shadow-sm">
              <Badge className="mb-4 bg-ml-primary/20 text-ml-primary hover:bg-ml-primary/30 border-none px-4 py-1 text-sm">
                Target: {responseData.target_month}
              </Badge>
              <p className="text-sm md:text-base text-muted-foreground mb-2 font-medium">Estimasi Total Penjualan Keseluruhan</p>
              <p className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                {formatCurrency(responseData.total_revenue)}
              </p>
            </div>

            {/* 2. Grafik Top 10 Produk */}
            <Top10PredictionChart data={responseData.top_10 || []} />

            {/* 3. Daftar Sisa Produk (Others) */}
            {responseData.others && responseData.others.length > 0 && (
              <Card className="shadow-neural border-ml-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LayoutList className="h-5 w-5 text-ml-primary" />
                    Rincian Prediksi Produk Lainnya
                  </CardTitle>
                  <CardDescription>
                    Estimasi penjualan untuk produk di luar daftar Top 10
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {responseData.others.map((product: any, idx: number) => (
                      <div key={idx} className="flex items-center space-x-3 p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors border border-transparent hover:border-ml-primary/10">
                        
                        {/* Ikon */}
                        <div className="flex-shrink-0">
                          <div className="bg-background p-2 rounded-full shadow-sm">
                            <Package className="h-5 w-5 text-slate-400" />
                          </div>
                        </div>

                        {/* Info Produk */}
                        <div className="flex-grow min-w-0">
                          <p className="font-medium text-sm md:text-base text-slate-700 dark:text-slate-200 truncate">
                            {product.name}
                          </p>
                          
                          <div className="flex items-center gap-3 mt-1.5">
                            {/* Badge Qty */}
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                              {product.qty} Pcs
                            </span>
                            
                            {/* Total Estimasi Harga */}
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                              {formatCurrency(product.revenue)}
                            </span>
                          </div>
                        </div>

                        {/* Badge Ranking */}
                        <Badge variant="secondary" className="text-xs shrink-0 h-fit bg-slate-100 text-slate-500">
                          #{product.rank}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

          </div>
        )}
      </div>
    </div>
  );
};