import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowLeft, TrendingUp, BarChart3, Package, Hourglass, CircleX } from "lucide-react";
import { useEffect, useState } from "react";
import { useDailyPredictions, useSingleDayPrediction, useTotalPredictions } from "@/hooks/usePredictions";
import { useDataSummary } from "@/store/DataSummaryStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { apiPredictSingleDay } from "@/api";

export const UserPeriod = () => {
  const handleBack = () => {
    window.history.back();
  };
  
  const ds = useDataSummary();
  
  const mini = new Date(ds.periode_akhir);
  mini.setDate(mini.getDate() + 1);
  const [selectedDate, setSelectedDate] = useState<string>(mini.toISOString().split('T')[0]);
  console.log(selectedDate);
  const [dateError, setDateError] = useState<string>("");

  // const { data: data_total, isLoading: is_loading_total } = useTotalPredictions();
  // const { data: data_daily } = useDailyPredictions();
  
  // const [dataDaily, setDataDaily] = useState<Map<number, string[]> | null>(null);
  // const [selectedPrediction, setSelectedPrediction] = useState<number | null>(null);
  // const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

  // Fetch prediction by date using React Query
  // const [predictionData, setPredictionData] = useState<any>(null);
  // const [isLoadingPrediction, setIsLoadingPrediction] = useState<boolean>(false);
  // const [predictionError, setPredictionError] = useState<Error>();
  const { data: predictionData, isLoading: isLoadingPrediction, error: predictionError, refetch } = useSingleDayPrediction(selectedDate);

  // Set default date to tomorrow when component mounts
  // useEffect(() => {
  //   const tomorrow = new Date();
  //   tomorrow.setDate(tomorrow.getDate() + 1);
  //   setSelectedDate(tomorrow.toISOString().split('T')[0]);
  // }, []);

  // Validate selected date
  useEffect(() => {
    if (!selectedDate) return;

    const selected = new Date(selectedDate);
    const limit = new Date(ds.periode_akhir);
    limit.setHours(0, 0, 0, 0);

    if (selected <= limit) {
      setDateError("Tanggal tidak boleh sebelum tanggal data train terakhir");
      return;
    }

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 90);

    if (selected > maxDate) {
      setDateError("Prediksi maksimal 90 hari ke depan");
      return;
    }

    setDateError("");

    // refetch();
  }, [selectedDate]);

  // Calculate prediction for selected date
  // useEffect(() => {
  //   if (!selectedDate || dateError || data_total?.job_status !== "success") {
  //     setSelectedPrediction(null);
  //     setSelectedDayIndex(null);
  //     return;
  //   }

  //   const selected = new Date(selectedDate);
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);

  //   const dayIndex = Math.ceil((selected.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  //   if (dayIndex < 0 || dayIndex >= data_total.data.length) {
  //     setSelectedPrediction(null);
  //     setSelectedDayIndex(null);
  //     return;
  //   }

  //   setSelectedDayIndex(dayIndex);
  //   setSelectedPrediction(data_total.data[dayIndex].hasil_total_penjualan_lstm);
  // }, [selectedDate, dateError, data_total]);

  // Process daily data
  // useEffect(() => {
  //   if (!data_daily || data_daily.job_status !== "success") return;

  //   const temp = new Map<number, string[]>();
  //   data_daily.data.forEach((row) => {
  //     const current = temp.get(row.hari) || [];
  //     current.push(row.hasil_nama_produk_lstm);
  //     temp.set(row.hari, current);
  //   });

  //   setDataDaily(temp);
  // }, [data_daily]);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMinDate = () => {
    const minDate = new Date(ds.periode_akhir);
    minDate.setDate(minDate.getDate() + 1);
    return minDate.toISOString().split('T')[0];
  }

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 90);
    return maxDate.toISOString().split('T')[0];
  };

  const handleSelectDate = async (e) => {
    setSelectedDate(e.target.value);
    console.log(predictionData);
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8 max-w-7xl flex flex-col flex-grow">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Dashboard
          </Button>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Prediksi <span className="bg-gradient-ml bg-clip-text text-transparent">Penjualan</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Pilih tanggal untuk melihat prediksi penjualan harian
          </p>
        </div>

        {/* Date Picker */}
        <Card className="shadow-neural border-ml-primary/20 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-ml-primary" />
              Pilih Tanggal Prediksi
            </CardTitle>
            <CardDescription>
              Pilih tanggal untuk melihat prediksi penjualan (maksimal 90 hari ke depan)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="prediction-date">Tanggal Prediksi</Label>
              <Input
                id="prediction-date"
                type="date"
                value={selectedDate}
                min={getMinDate()}
                max={getMaxDate()}
                onChange={handleSelectDate}
                className="w-full max-w-md"
              />
              {dateError && (
                <p className="text-sm text-red-500">{dateError}</p>
              )}
              {!dateError && selectedDate && (
                <p className="text-sm text-muted-foreground">
                  Prediksi untuk: {new Date(selectedDate).toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {isLoadingPrediction ? (
          <div className="text-center grid grid-cols-1 gap-6">
            <div className="text-center p-4 bg-muted/20 rounded-lg">
              <Hourglass className="h-8 w-8 text-ml-accent mx-auto mb-2 animate-spin" />
              <h4 className="font-semibold mb-1">
                {isLoadingPrediction ? 'Memuat prediksi...' : 'Data anda sedang diproses, mohon tunggu'}
              </h4>
            </div>
          </div>
        ) : (
          <>
            {(predictionError) ? (
              <main className="flex-grow flex items-center justify-center">
                <div className="text-center grid grid-cols-1 gap-6">
                  <div className="text-center p-4 bg-muted/20 rounded-lg">
                    <CircleX className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Data anda gagal diproses</h4>
                  </div>
                </div>
              </main>
            ) : (
              <>
                {/* Prediction Display */}
                {!predictionError && !dateError && (
                  <Card className="shadow-neural border-ml-primary/20 mb-8">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-ml-primary" />
                        Hasil Prediksi
                      </CardTitle>
                      <CardDescription>
                        Prediksi penjualan untuk {new Date(selectedDate).toLocaleDateString('id-ID', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Total Sales Prediction */}
                        <div className="p-6 bg-gradient-to-br from-ml-primary/10 to-ml-accent/10 rounded-lg border border-ml-primary/20">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-2">Estimasi Total Penjualan</p>
                            <p className="text-3xl md:text-4xl font-bold text-ml-primary">
                              {predictionData["prediction_summary"]["total_sales_forecast"].toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                            </p>
                          </div>
                        </div>

                        {/* Top Products / Product Details */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-lg">Rincian Produk Terjual</h4>
                          <div className="grid gap-3">
                            {(predictionData["top_5_products"])?.map((product: any, idx: number) => (
                              <div key={idx} className="flex items-center space-x-3 p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors border border-transparent hover:border-ml-primary/10">
                                
                                {/* Icon */}
                                <div className="flex-shrink-0">
                                  <div className="bg-background p-2 rounded-full shadow-sm">
                                    <Package className="h-5 w-5 text-ml-accent" />
                                  </div>
                                </div>

                                {/* Product Info */}
                                <div className="flex-grow min-w-0">
                                  <p className="font-medium text-sm md:text-base truncate">
                                    {product["product_name"]}
                                  </p>
                                  
                                  {/* Baris Baru: Qty dan Harga */}
                                  <div className="flex items-center gap-3 mt-1.5">
                                    {/* Badge Qty */}
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                      {product["estimated_qty"]} Pcs
                                    </span>
                                    
                                    {/* Total Sales Price */}
                                    <span className="text-xs font-bold text-ml-primary">
                                      {product["estimated_sales_idr"]}
                                    </span>
                                  </div>
                                </div>

                                {/* Rank Badge */}
                                <Badge variant="secondary" className="text-xs shrink-0 h-fit">
                                  #{idx + 1}
                                </Badge>
                              </div>
                            )) || (
                              <p className="text-sm text-muted-foreground text-center py-4">
                                Data produk tidak tersedia untuk tanggal ini
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Display API Response Data */}
                        {/* {predictionData && (
                          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                            <h4 className="font-semibold text-sm text-blue-700 dark:text-blue-400 mb-2">
                              Data dari API:
                            </h4>
                            <pre className="text-xs overflow-auto">
                              {JSON.stringify(predictionData, null, 2)}
                            </pre>
                          </div>
                        )} */}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Error State */}
                {predictionError && (
                  <Card className="shadow-neural border-red-500/20 mb-8">
                    <CardContent className="py-8">
                      <div className="text-center">
                        <CircleX className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Gagal Memuat Prediksi</h3>
                        <p className="text-muted-foreground">
                          {predictionError instanceof Error ? predictionError.message : 'Terjadi kesalahan saat memuat data'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Empty State */}
                {/* {!dateError && selectedDate && selectedPrediction === null && (
                  <Card className="shadow-neural border-ml-primary/20 mb-8">
                    <CardContent className="py-12">
                      <div className="text-center">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Pilih Tanggal</h3>
                        <p className="text-muted-foreground">
                          Pilih tanggal di atas untuk melihat prediksi penjualan
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )} */}

                {/* Data Range Information */}
              </>
            )}
          </>
        )}
        
        <Card className="shadow-neural border-ml-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-ml-primary" />
              Informasi Data Training
            </CardTitle>
            <CardDescription>
              Periode data yang digunakan untuk melatih model prediksi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <Calendar className="h-8 w-8 text-ml-accent mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Mulai</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(ds.periode_awal).toLocaleString('id-ID', { month: "long", year: "numeric" })}
                </p>
              </div>
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <Calendar className="h-8 w-8 text-ml-accent mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Berakhir</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(ds.periode_akhir).toLocaleString('id-ID', { month: "long", year: "numeric" })}
                </p>
              </div>
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <TrendingUp className="h-8 w-8 text-ml-accent mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Total Hari</h4>
                <p className="text-sm text-muted-foreground">
                  {Math.round((new Date(ds.periode_akhir).getTime() - new Date(ds.periode_awal).getTime()) / (1000 * 60 * 60 * 24)).toLocaleString('id-ID')} hari
                </p>
              </div>
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <BarChart3 className="h-8 w-8 text-ml-accent mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Total Transaksi</h4>
                <p className="text-sm text-muted-foreground">
                  {ds.total_transaksi.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};