import { useEffect, useState, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { PredictionChartMonthly } from "@/components/charts/PredictionChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Download,
  ArrowLeft,
  Hourglass,
  CircleX,
  ArrowDownUp, 
  CalendarDays,
  TrendingUp,
  PackageOpen
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PredictionComparisonBase, useCompareMonths, usePredictionMetrics } from "@/hooks/usePredictions";
import * as XLSX from "xlsx";
import { useAuthNamaToko, useAuthRole } from "@/store/AuthStore";
import { ProductComparisonChart } from "@/components/charts/ProductComparisonChart";

// ============================================================================
// HALAMAN UTAMA PREDICTIONS
// ============================================================================
export const Predictions = () => {
  const navigate = useNavigate();

  // State Filter
  const [compareSortBy, setCompareSortBy] = useState<'revenue' | 'qty'>('revenue');
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const { data: data_comparisons, isLoading: is_loading_comparisons, isError: is_error_comparisons } = useCompareMonths();
  const { data: data_metrics, isLoading: is_loading_metrics } = usePredictionMetrics();

  const nama_toko = useAuthNamaToko();
  const role = useAuthRole();

  // 1. FILTER BULAN HISTORIS SAJA (Sembunyikan Forecast)
  const historicalMonths = useMemo(() => {
    if (!data_comparisons?.data) return [];
    return data_comparisons.data.filter((item: any) => 
      item.type !== "Forecast" && !item.period.includes("(Prediksi)")
    );
  }, [data_comparisons]);

  // 2. Set default bulan ke yang paling terakhir/terbaru
  useEffect(() => {
    if (historicalMonths && historicalMonths.length > 0 && !selectedMonth) {
      const latest = historicalMonths[historicalMonths.length - 1]; 
      setSelectedMonth(latest.period);
    }
  }, [historicalMonths, selectedMonth]);

  // 3. Ekstrak data produk khusus untuk bulan yang dipilih
  const currentMonthData = useMemo(() => {
    if (!data_comparisons?.data || !selectedMonth) return [];
    
    // Cari objek bulan yang cocok dengan dropdown
    const foundMonth = data_comparisons.data.find((item: any) => item.period === selectedMonth);
    if (!foundMonth) return [];

    // Tentukan array mana yang dipanggil berdasarkan filter metrik
    return compareSortBy === 'revenue' 
      ? (foundMonth.product_breakdown_revenue || [])
      : (foundMonth.product_breakdown_qty || []);
      
  }, [data_comparisons, selectedMonth, compareSortBy]); // <-- Pastikan compareSortBy masuk ke array dependency

  const selectedMonthLabel = useMemo(() => {
    if (!selectedMonth) return "Memuat...";
    const [year, month] = selectedMonth.split('-');
    const monthName = new Date(2000, parseInt(month) - 1, 1).toLocaleString('id-ID', { month: "long" });
    return `${monthName} ${year}`;
  }, [selectedMonth]);

  const metric = [
    "Mean Absolute Error (MAE)",
    "Root Mean Squared Error (RMSE)",
    "Training Time",
    "Memory Usage"
  ];

  const formatNumberId = (num: number) => new Intl.NumberFormat('id-ID').format(num);
  const formatNumber = (num: number) => new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(num);

  const handleExportExcel = () => {
    if (!data_comparisons || !data_metrics) {
      alert("Data belum siap untuk diekspor!");
      return;
    }

    const comparisonSheetData = data_comparisons["data"].map((item: PredictionComparisonBase) => ({
      Bulan: item["period"],
      Aktual: item["actual"],
      ARIMA: item["arima_pred"],
      LSTM: item["lstm_pred"],
    }));
    const comparisonSheet = XLSX.utils.json_to_sheet(comparisonSheetData);

    const metricSheetData = [
      { Metric: "Mean Absolute Error (MAE)", ARIMA: data_metrics.data.arima_mae, LSTM: data_metrics.data.lstm_mae },
      { Metric: "Root Mean Squared Error (RMSE)", ARIMA: data_metrics.data.arima_rmse, LSTM: data_metrics.data.lstm_rmse },
      { Metric: "Training Time (s)", ARIMA: data_metrics.data.arima_waktu_train, LSTM: data_metrics.data.lstm_waktu_train },
      { Metric: "Memory Usage (MB)", ARIMA: data_metrics.data.arima_memori, LSTM: data_metrics.data.lstm_memori },
    ];
    const metricSheet = XLSX.utils.json_to_sheet(metricSheetData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, comparisonSheet, "Prediction Comparisons");
    XLSX.utils.book_append_sheet(workbook, metricSheet, "Prediction Metrics");

    if(nama_toko != ""){
      XLSX.writeFile(workbook, `Prediksi Toko ${nama_toko}.xlsx`);
    } else{
      XLSX.writeFile(workbook, "Prediksi Toko.xlsx");
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-hero">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl flex flex-col flex-grow">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Dashboard
          </Button>

          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Prediksi <span className="bg-gradient-ml bg-clip-text text-transparent">Penjualan</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Hasil prediksi penjualan menggunakan algoritma ARIMA dan LSTM
          </p>
        </div>
          {
            is_loading_comparisons ? (
                <main className="flex-grow flex items-center justify-center">
                  <div className="text-center grid grid-cols-1 gap-6">
                    <div className="text-center p-4 bg-muted/20 rounded-lg">
                      <Hourglass className="h-8 w-8 text-ml-accent mx-auto mb-2 animate-spin" />
                      <h4 className="font-semibold mb-1">Data anda sedang diproses, mohon tunggu</h4>
                    </div>
                  </div>
                </main>
              ) :
            <>
            {
              is_error_comparisons ? (
                  <div className="text-center grid grid-cols-1 gap-6">
                    <div className="text-center p-4 bg-muted/20 rounded-lg">
                      <CircleX className="h-8 w-8 text-red-500 mx-auto mb-2" />
                      <h4 className="font-semibold mb-1">Data anda gagal diproses</h4>
                    </div>
                  </div>
              ) : 
                
              <>
                { 
                  data_comparisons['job_status'] == "running" ? (
                    <main className="flex-grow flex items-center justify-center">
                      <div className="text-center grid grid-cols-1 gap-6">
                        <div className="text-center p-4 bg-muted/20 rounded-lg">
                          <Hourglass className="h-8 w-8 text-ml-accent mx-auto mb-2 animate-spin" />
                          <h4 className="font-semibold mb-1">{ data_metrics['job_status'] == "running" ? "Data anda dalam proses training, mohon tunggu" : "Data anda sedang diproses, mohon tunggu"}</h4>
                        </div>
                      </div>
                    </main>
                  ) : (
                    <>
                    {
                      role == "OWNER" &&
                      <>
                        <div className="flex flex-wrap gap-4 mb-8">
                          <Button variant="ml" className="border-ml-primary/30 hover:bg-ml-primary/10" onClick={handleExportExcel}>
                            <Download className="h-4 w-4 mr-2" />
                            Export Results
                          </Button>
                        </div>
                      </>
                    }

                    {/* Chart Bulanan (Garis) */}
                    <div className="mb-8">
                      {
                        !is_loading_comparisons && <PredictionChartMonthly data={data_comparisons["data"]} />
                      }
                    </div>

                    {/* ========================================================================= */}
                    {/* FILTER & GRAFIK KOMPARASI BREAKDOWN PRODUK                                */}
                    {/* ========================================================================= */}
                    {!is_loading_comparisons && data_comparisons?.data && historicalMonths.length > 0 && (
                      <div className="mb-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 gap-4">
                          
                          {/* Toggle Sortir (Revenue / Qty) */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
                            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                              <ArrowDownUp className="h-5 w-5 text-ml-primary" />
                              <span className="font-semibold text-sm">Metrik Komparasi:</span>
                            </div>
                            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-full sm:w-auto">
                              <button
                                onClick={() => setCompareSortBy('revenue')}
                                className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                                  compareSortBy === 'revenue' 
                                    ? 'bg-white dark:bg-slate-700 text-ml-primary shadow-sm ring-1 ring-slate-200/50' 
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                              >
                                Pendapatan
                              </button>
                              <button
                                onClick={() => setCompareSortBy('qty')}
                                className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                                  compareSortBy === 'qty' 
                                    ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm ring-1 ring-slate-200/50' 
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                              >
                                Kuantitas
                              </button>
                            </div>
                          </div>

                          {/* Dropdown Filter Bulan (Hanya Bulan Historis) */}
                          <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                              <CalendarDays className="h-5 w-5 text-ml-primary" />
                              <span className="font-semibold text-sm whitespace-nowrap">Pilih Bulan Aktual:</span>
                            </div>
                            <select 
                              className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-none text-sm font-medium rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-ml-primary w-full cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                              value={selectedMonth}
                              onChange={(e) => setSelectedMonth(e.target.value)}
                            >
                              <option value="" disabled>-- Pilih Bulan --</option>
                              {historicalMonths.map((item: any) => {
                                const val = item.period; 
                                const [year, month] = val.split('-');
                                const monthName = new Date(2000, parseInt(month)-1, 1).toLocaleString('id-ID', {month: "long"});
                                const label = `${monthName} ${year}`;
                                
                                return <option key={val} value={val}>{label}</option>;
                              })}
                            </select>
                          </div>

                        </div>

                        {/* Rendering Grafik (Terintegrasi ke currentMonthData dari Backend) */}
                        <ProductComparisonChart 
                          data={currentMonthData} 
                          sortBy={compareSortBy} 
                          monthLabel={selectedMonthLabel} 
                        />
                      </div>
                    )}
                    {/* ========================================================================= */}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Model Comparison */}
                      <Card className="shadow-neural border-ml-primary/20 lg:col-span-2">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-ml-primary" />
                            Perbandingan Detail Model
                          </CardTitle>
                          <CardDescription>
                            Evaluasi performa algoritma ARIMA vs LSTM
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {
                              is_loading_metrics ? (
                                <p>Loading...</p>
                              ) : (
                                <>
                                  {/* MAE */}
                                  <div className="p-4 bg-muted/20 rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="font-medium">{metric[0]}</span>
                                      {Number(data_metrics.data.arima_mae) > Number(data_metrics.data.lstm_mae) ? (
                                        <Badge className="bg-lstm/10 text-lstm border-lstm/20">LSTM Unggul</Badge>
                                      ) : (
                                        <Badge className="bg-arima/10 text-arima border-arima/20">ARIMA Unggul</Badge>
                                      )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="text-center p-3 bg-arima/5 border border-arima/20 rounded">
                                        <div className="text-lg font-semibold text-arima">{formatNumberId(data_metrics.data.arima_mae)}</div>
                                        <div className="text-xs text-muted-foreground">ARIMA</div>
                                      </div>
                                      <div className="text-center p-3 bg-lstm/5 border border-lstm/20 rounded">
                                        <div className="text-lg font-semibold text-lstm">{formatNumberId(data_metrics.data.lstm_mae)}</div>
                                        <div className="text-xs text-muted-foreground">LSTM</div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* RMSE */}
                                  <div className="p-4 bg-muted/20 rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="font-medium">{metric[1]}</span>
                                      {Number(data_metrics.data.arima_rmse) > Number(data_metrics.data.lstm_rmse) ? (
                                        <Badge className="bg-lstm/10 text-lstm border-lstm/20">LSTM Unggul</Badge>
                                      ) : (
                                        <Badge className="bg-arima/10 text-arima border-arima/20">ARIMA Unggul</Badge>
                                      )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="text-center p-3 bg-arima/5 border border-arima/20 rounded">
                                        <div className="text-lg font-semibold text-arima">{formatNumber(data_metrics.data.arima_rmse)}</div>
                                        <div className="text-xs text-muted-foreground">ARIMA</div>
                                      </div>
                                      <div className="text-center p-3 bg-lstm/5 border border-lstm/20 rounded">
                                        <div className="text-lg font-semibold text-lstm">{formatNumber(data_metrics.data.lstm_rmse)}</div>
                                        <div className="text-xs text-muted-foreground">LSTM</div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Waktu Train */}
                                  <div className="p-4 bg-muted/20 rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="font-medium">{metric[2]}</span>
                                      {Number(data_metrics.data.arima_waktu_train) > Number(data_metrics.data.lstm_waktu_train) ? (
                                        <Badge className="bg-lstm/10 text-lstm border-lstm/20">LSTM Unggul</Badge>
                                      ) : (
                                        <Badge className="bg-arima/10 text-arima border-arima/20">ARIMA Unggul</Badge>
                                      )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="text-center p-3 bg-arima/5 border border-arima/20 rounded">
                                        <div className="text-lg font-semibold text-arima">{formatNumber(data_metrics.data.arima_waktu_train)} detik</div>
                                        <div className="text-xs text-muted-foreground">ARIMA</div>
                                      </div>
                                      <div className="text-center p-3 bg-lstm/5 border border-lstm/20 rounded">
                                        <div className="text-lg font-semibold text-lstm">{formatNumber(data_metrics.data.lstm_waktu_train)} detik</div>
                                        <div className="text-xs text-muted-foreground">LSTM</div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Memori */}
                                  <div className="p-4 bg-muted/20 rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="font-medium">{metric[3]}</span>
                                      {Number(data_metrics.data.arima_memori) > Number(data_metrics.data.lstm_memori) ? (
                                        <Badge className="bg-lstm/10 text-lstm border-lstm/20">LSTM Unggul</Badge>
                                      ) : (
                                        <Badge className="bg-arima/10 text-arima border-arima/20">ARIMA Unggul</Badge>
                                      )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="text-center p-3 bg-arima/5 border border-arima/20 rounded">
                                        <div className="text-lg font-semibold text-arima">{formatNumber(data_metrics.data.arima_memori)} MB</div>
                                        <div className="text-xs text-muted-foreground">ARIMA</div>
                                      </div>
                                      <div className="text-center p-3 bg-lstm/5 border border-lstm/20 rounded">
                                        <div className="text-lg font-semibold text-lstm">{formatNumber(data_metrics.data.lstm_memori)} MB</div>
                                        <div className="text-xs text-muted-foreground">LSTM</div>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )
                            }
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    </>
                  )
                }
              </>
            }
            </>
          }
      </div>
    </div>
  );
};