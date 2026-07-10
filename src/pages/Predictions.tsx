import { useEffect, useState, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { PredictionChartMonthly } from "@/components/charts/PredictionChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Target, 
  Download,
  ArrowLeft,
  Hourglass,
  CircleX,
  ArrowDownUp, 
  CalendarDays,
  LayoutList,
  PackageOpen,
  ChevronDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PredictionComparisonBase, useCompareMonths, usePredictionMetrics } from "@/hooks/usePredictions";
import * as XLSX from "xlsx";
import { useAuthNamaToko, useAuthRole } from "@/store/AuthStore";

// ============================================================================
// 1. KOMPONEN TABEL KOMPARASI (PREDIKSI VS AKTUAL BERDASARKAN NAMA)
// ============================================================================
export const ProductComparisonTable = ({ 
  data = [], 
  selectedMonth, 
  setSelectedMonth, 
  historicalMonths 
}: { 
  data?: any[], 
  selectedMonth: string, 
  setSelectedMonth: (val: string) => void, 
  historicalMonths: any[] 
}) => {
  
  const alignedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const preds: any[] = [];
    const actuals: any[] = [];

    data.forEach(d => {
      if (d.pred_name && d.pred_name !== "-") preds.push({ name: d.pred_name, rev: d.pred_revenue, qty: d.pred_qty });
      if (d.actual_name && d.actual_name !== "-") actuals.push({ name: d.actual_name, rev: d.actual_revenue, qty: d.actual_qty });
    });

    const predNames = preds.map(p => p.name);
    const actualNames = actuals.map(a => a.name);
    const commonNames = predNames.filter(name => actualNames.includes(name));

    // Urutkan default berdasarkan Pendapatan
    commonNames.sort((a, b) => {
      const pA = preds.find(p => p.name === a)!;
      const pB = preds.find(p => p.name === b)!;
      return pB.rev - pA.rev;
    });

    const onlyPreds = preds.filter(p => !commonNames.includes(p.name)).sort((a, b) => b.rev - a.rev);
    const onlyActuals = actuals.filter(a => !commonNames.includes(a.name)).sort((a, b) => b.rev - a.rev);

    const rows = [];
    commonNames.forEach(name => {
      const p = preds.find(x => x.name === name)!;
      const a = actuals.find(x => x.name === name)!;
      rows.push({
        pred_name: p.name, pred_val_rev: p.rev, pred_val_qty: p.qty,
        actual_name: a.name, actual_val_rev: a.rev, actual_val_qty: a.qty
      });
    });

    const maxRemaining = Math.max(onlyPreds.length, onlyActuals.length);
    for (let i = 0; i < maxRemaining; i++) {
      const p = onlyPreds[i] || { name: "-", rev: 0, qty: 0 };
      const a = onlyActuals[i] || { name: "-", rev: 0, qty: 0 };
      rows.push({
        pred_name: p.name, pred_val_rev: p.rev, pred_val_qty: p.qty,
        actual_name: a.name, actual_val_rev: a.rev, actual_val_qty: a.qty
      });
    }

    return rows;
  }, [data]);

  const formatRev = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  const formatQty = (val: number) => new Intl.NumberFormat('id-ID').format(val);

  return (
    <Card className="shadow-neural border-ml-primary/20 mb-8 overflow-hidden">
      <CardHeader className="text-center pb-4 border-b border-slate-200 bg-slate-50/50">
        <CardTitle className="text-xl font-bold text-slate-800 flex items-center justify-center gap-2">
          <LayoutList className="h-5 w-5 text-ml-primary" />
          Rincian Produk: Prediksi vs Aktual
        </CardTitle>
        
        {/* DROPDOWN FILTER PINDAH KE SINI */}
        {/* DROPDOWN FILTER PINDAH KE SINI */}
        <div className="flex justify-center items-center mt-3">
          <div className="relative flex items-center gap-2 bg-white dark:bg-slate-800 pl-3 pr-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:border-ml-primary/50 focus-within:ring-2 focus-within:ring-ml-primary/20">
            <CalendarDays className="h-4 w-4 text-ml-primary" />
            <select 
              className="bg-transparent text-slate-700 dark:text-slate-200 border-none text-sm font-semibold outline-none cursor-pointer appearance-none pr-6 z-10 w-full"
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
            {/* Ikon Chevron Custom */}
            <ChevronDown className="h-4 w-4 text-slate-500 absolute right-2 pointer-events-none" />
          </div>
        </div>
      </CardHeader>
      
      {(!data || data.length === 0) ? (
        <CardContent className="flex flex-col items-center justify-center h-[300px] text-center">
          <PackageOpen className="h-12 w-12 text-slate-300 mb-3" />
          <p className="text-lg font-semibold text-slate-600">Belum Ada Rincian Produk</p>
          <p className="text-sm text-slate-500">Silakan jalankan ulang prediksi agar data tabel diperbarui.</p>
        </CardContent>
      ) : (
        <div className="overflow-x-auto max-h-[600px] relative">
          <Table>
            <TableHeader className="bg-slate-100 sticky top-0 z-10 shadow-sm">
              <TableRow>
                <TableHead colSpan={3} className="text-center border-r border-slate-300 font-bold text-blue-700 bg-blue-50/50 uppercase tracking-wider">Prediksi Model</TableHead>
                <TableHead colSpan={3} className="text-center font-bold text-emerald-700 bg-emerald-50/50 uppercase tracking-wider">Data Aktual</TableHead>
              </TableRow>
              <TableRow className="bg-slate-100 shadow-sm border-b-2 border-slate-200 text-xs">
                <TableHead className="w-[20%] font-semibold text-slate-700">Nama Produk</TableHead>
                <TableHead className="w-[10%] font-semibold text-slate-700 text-right">Qty</TableHead>
                <TableHead className="w-[20%] font-semibold text-slate-700 border-r border-slate-300 text-right">Pendapatan</TableHead>
                <TableHead className="w-[20%] font-semibold text-slate-700">Nama Produk</TableHead>
                <TableHead className="w-[10%] font-semibold text-slate-700 text-right">Qty</TableHead>
                <TableHead className="w-[20%] font-semibold text-slate-700 text-right">Pendapatan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alignedData.map((row, idx) => {
                const isMatch = row.pred_name !== '-' && row.actual_name !== '-' && row.pred_name === row.actual_name;

                return (
                  <TableRow key={idx} className={`transition-colors ${isMatch ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/30 hover:bg-slate-100/50'}`}>
                    <TableCell className={`font-medium ${row.pred_name !== '-' ? 'text-slate-800' : 'text-slate-400'}`}>
                      {row.pred_name}
                    </TableCell>
                    <TableCell className={`text-right ${row.pred_name !== '-' ? 'text-blue-600 font-semibold' : 'text-slate-400'}`}>
                      {row.pred_name !== '-' ? formatQty(row.pred_val_qty) : '-'}
                    </TableCell>
                    <TableCell className={`border-r border-slate-200 text-right ${row.pred_name !== '-' ? 'text-blue-600 font-semibold' : 'text-slate-400'}`}>
                      {row.pred_name !== '-' ? formatRev(row.pred_val_rev) : '-'}
                    </TableCell>
                    
                    <TableCell className={`font-medium ${row.actual_name !== '-' ? 'text-slate-800' : 'text-slate-400'}`}>
                      {row.actual_name}
                    </TableCell>
                    <TableCell className={`text-right ${row.actual_name !== '-' ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                      {row.actual_name !== '-' ? formatQty(row.actual_val_qty) : '-'}
                    </TableCell>
                    <TableCell className={`text-right ${row.actual_name !== '-' ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                      {row.actual_name !== '-' ? formatRev(row.actual_val_rev) : '-'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
};

// ============================================================================
// HALAMAN UTAMA PREDICTIONS
// ============================================================================
export const Predictions = () => {
  const navigate = useNavigate();

  // State Filter Komparasi Produk\
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const { data: data_comparisons, isLoading: is_loading_comparisons, isError: is_error_comparisons } = useCompareMonths();
  const { data: data_metrics, isLoading: is_loading_metrics } = usePredictionMetrics();

  const nama_toko = useAuthNamaToko();
  const role = useAuthRole();

  // 1. FILTER BULAN HISTORIS SAJA (Sembunyikan Forecast dari opsi Tabel Rincian Aktual)
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

  // 3. Ekstrak data produk khusus untuk bulan yang dipilih (Sesuai metrik)
  const currentMonthData = useMemo(() => {
    if (!data_comparisons?.data || !selectedMonth) return [];
    const foundMonth = data_comparisons.data.find((item: any) => item.period === selectedMonth);
    if (!foundMonth) return [];

    // Langsung kembalikan array ini karena di dalamnya sudah terdapat Qty & Revenue
    return foundMonth.product_breakdown_revenue || [];
  }, [data_comparisons, selectedMonth]);

  // const selectedMonthLabel = useMemo(() => {
  //   if (!selectedMonth) return "Memuat...";
  //   const [year, month] = selectedMonth.split('-');
  //   const monthName = new Date(2000, parseInt(month) - 1, 1).toLocaleString('id-ID', { month: "long" });
  //   return `${monthName} ${year}`;
  // }, [selectedMonth]);

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
                    {/* TABEL KOMPARASI BREAKDOWN PRODUK                                          */}
                    {/* ========================================================================= */}
                    {!is_loading_comparisons && data_comparisons?.data && historicalMonths.length > 0 && (
                      <ProductComparisonTable 
                        data={currentMonthData} 
                        selectedMonth={selectedMonth}
                        setSelectedMonth={setSelectedMonth}
                        historicalMonths={historicalMonths}
                      />
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