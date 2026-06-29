import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Hourglass, CircleX, Package, LayoutList, ArrowDownUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTop10NextMonth } from "@/hooks/usePredictions";
import { Top10PredictionChart } from "@/components/charts/ProductPredictionChart";

export const UserPeriod = () => {
  const navigate = useNavigate();
  // State untuk menyimpan pilihan filter user ('revenue' atau 'qty')
  const [sortBy, setSortBy] = useState<'revenue' | 'qty'>('revenue');

  const { data: responseData, isLoading, error } = useTop10NextMonth();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(value);
  };

  // Memoization agar pengurutan hanya berjalan ketika data atau filter berubah
  const { displayTop10, displayOthers } = useMemo(() => {
    if (!responseData) return { displayTop10: [], displayOthers: [] };

    // 1. Gabungkan semua produk dari API
    const allProducts = [...(responseData.top_10 || []), ...(responseData.others || [])];

    // 2. Sort ulang berdasarkan pilihan user
    const sortedProducts = allProducts.sort((a, b) => {
      if (sortBy === 'qty') {
        // Jika jumlah qty sama, urutkan berdasarkan revenue sebagai tie-breaker
        if (b.qty === a.qty) return b.revenue - a.revenue;
        return b.qty - a.qty;
      }
      return b.revenue - a.revenue;
    }).map((item, index) => ({
      ...item,
      rank: index + 1 // 3. Hitung ulang ranking (1, 2, 3...)
    }));

    // 4. Pecah kembali menjadi top 10 dan sisanya
    return {
      displayTop10: sortedProducts.slice(0, 10),
      displayOthers: sortedProducts.slice(10)
    };
  }, [responseData, sortBy]);

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
                Target: {responseData?.target_month || "Menyiapkan..."}
              </Badge>
              <p className="text-sm md:text-base text-muted-foreground mb-2 font-medium">Estimasi Total Penjualan Keseluruhan</p>
              <p className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                {formatCurrency(responseData?.total_revenue || 0)}
              </p>
            </div>

            {/* Kontrol Toggle Filter/Sort */}
            <div className="flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 mb-3 sm:mb-0 text-slate-700 dark:text-slate-300">
                <ArrowDownUp className="h-5 w-5 text-ml-primary" />
                <span className="font-semibold text-sm">Urutkan Peringkat Berdasarkan:</span>
              </div>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-full sm:w-auto">
                <button
                  onClick={() => setSortBy('revenue')}
                  className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    sortBy === 'revenue' 
                      ? 'bg-white dark:bg-slate-700 text-ml-primary shadow-sm ring-1 ring-slate-200/50' 
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  Pendapatan
                </button>
                <button
                  onClick={() => setSortBy('qty')}
                  className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    sortBy === 'qty' 
                      ? 'bg-white dark:bg-slate-700 text-ml-primary shadow-sm ring-1 ring-slate-200/50' 
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  Kuantitas (Qty)
                </button>
              </div>
            </div>

            {/* 2. Grafik Top 10 Produk */}
            <Top10PredictionChart data={displayTop10} sortBy={sortBy} />

            {/* 3. Daftar Sisa Produk (Others) */}
            {displayOthers && displayOthers.length > 0 && (
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
                    {displayOthers.map((product: any, idx: number) => (
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
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${sortBy === 'qty' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                              {product.qty} Pcs
                            </span>
                            
                            {/* Total Estimasi Harga */}
                            <span className={`text-xs font-bold ${sortBy === 'revenue' ? 'text-ml-primary' : 'text-slate-500'}`}>
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