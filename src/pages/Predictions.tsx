import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { PredictionChart } from "@/components/charts/PredictionChart";
import { MetricCard } from "@/components/cards/MetricCard";
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
  BrainCircuit, 
  TrendingUp, 
  Target, 
  Play,
  Download,
  RefreshCw,
  Calendar,
  BarChart3,
  ArrowLeft,
  Hourglass,
  CircleX
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PredictionComparisonBase, useCompare, usePredictionComparisons, usePredictionMetrics, useSevenDaysPrediction, useTotalPredictions } from "@/hooks/usePredictions";
import * as XLSX from "xlsx";
import { useAuthNamaToko } from "@/store/AuthStore";

export const Predictions = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: data_total, isLoading: is_loading_total, isError: is_error_total } = useSevenDaysPrediction(new Date().toISOString().split('T')[0]);
  const { data: data_comparisons, isLoading: is_loading_comparisons, isError: is_error_comparisons } = useCompare();
  const { data: data_metrics, isLoading: is_loading_metrics, isError: is_error_metrics } = usePredictionMetrics();

  const nama_toko = useAuthNamaToko();

  const metric = [
    "Mean Absolute Error (MAE)",
    "Root Mean Squared Error (RMSE)",
    "Training Time",
    "Memory Usage"
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumberId = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      maximumFractionDigits: 2,
    }).format(num);
  }

  const handleGeneratePrediction = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  const handleExportExcel = () => {
    if (!data_total || !data_comparisons || !data_metrics) {
      alert("Data belum siap untuk diekspor!");
      return;
    }

    // 1️⃣ Total Predictions Sheet
    const totalSheetData = data_total["predictions"].map((item: any, index: number) => ({
      No: index + 1,
      Tanggal: new Date(item["date"]).toLocaleDateString("id-ID"),
      "Total Penjualan ARIMA": item["ARIMA"]["value"],
      "Total Penjualan LSTM": item["LSTM"]["value"],
      "Selisih": Math.abs(item["ARIMA"]["value"] - item["LSTM"]["value"])
    }));
    const totalSheet = XLSX.utils.json_to_sheet(totalSheetData);

    // 2️⃣ Prediction Comparisons Sheet
    const comparisonSheetData = data_comparisons["data"].map((item: PredictionComparisonBase) => ({
      Hari: item["day"],
      Aktual: item["actual"],
      ARIMA: item["arima_pred"],
      LSTM: item["lstm_pred"],
    }));
    const comparisonSheet = XLSX.utils.json_to_sheet(comparisonSheetData);

    // 3️⃣ Prediction Metrics Sheet
    const metricSheetData = [
      {
        Metric: "Mean Absolute Error (MAE)",
        ARIMA: data_metrics.data.arima_mae,
        LSTM: data_metrics.data.lstm_mae,
      },
      {
        Metric: "Root Mean Squared Error (RMSE)",
        ARIMA: data_metrics.data.arima_rmse,
        LSTM: data_metrics.data.lstm_rmse,
      },
      {
        Metric: "Training Time (s)",
        ARIMA: data_metrics.data.arima_waktu_train,
        LSTM: data_metrics.data.lstm_waktu_train,
      },
      {
        Metric: "Memory Usage (MB)",
        ARIMA: data_metrics.data.arima_memori,
        LSTM: data_metrics.data.lstm_memori,
      },
    ];
    const metricSheet = XLSX.utils.json_to_sheet(metricSheetData);

    // 4️⃣ Buat workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, totalSheet, "Total Predictions");
    XLSX.utils.book_append_sheet(workbook, comparisonSheet, "Prediction Comparisons");
    XLSX.utils.book_append_sheet(workbook, metricSheet, "Prediction Metrics");

    // 5️⃣ Simpan file
    if(nama_toko != ""){
      XLSX.writeFile(workbook, `Prediksi Toko ${nama_toko}.xlsx`);
    }
    else{
      XLSX.writeFile(workbook, "Prediksi Toko.xlsx");
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-hero">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl flex flex-col flex-grow">
        {/* Header */}
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
            Prediksi <span className="bg-gradient-ml bg-clip-text text-transparent">Penjualan</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Hasil prediksi penjualan menggunakan algoritma ARIMA dan LSTM
          </p>
        </div>

          {
            is_loading_total ?
            (
              <main className="flex-grow flex items-center justify-center">
                <div className="text-center grid grid-cols-1 gap-6">
                  <div className="text-center p-4 bg-muted/20 rounded-lg">
                    <Hourglass className="h-8 w-8 text-ml-accent mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Data anda sedang diproses, mohon tunggu</h4>
                  </div>
                </div>
              </main>
            ) :
            <>
              { 
                is_error_total ?
                (
                    <div className="text-center grid grid-cols-1 gap-6">
                      <div className="text-center p-4 bg-muted/20 rounded-lg">
                        <CircleX className="h-8 w-8 text-red-500 mx-auto mb-2" />
                        <h4 className="font-semibold mb-1">Data anda gagal diproses</h4>
                      </div>
                    </div>
                ) : (
                  <>
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4 mb-8">
                    <Button variant="ml" className="border-ml-primary/30 hover:bg-ml-primary/10" onClick={handleExportExcel}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Results
                    </Button>
                  </div>

                  {/* Prediction Chart */}
                  <div className="mb-8">
                    {
                      !is_loading_comparisons && <PredictionChart data={data_comparisons["data"]} />
                    }
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Prediction Results Table */}
                    <Card className="shadow-neural border-ml-primary/20 lg:col-span-2">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-ml-primary" />
                          Hasil Prediksi 7 Hari Mendatang
                        </CardTitle>
                        <CardDescription>
                          Perbandingan prediksi penjualan ARIMA vs LSTM
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="rounded-md border overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Periode</TableHead>
                                <TableHead>Tanggal</TableHead>
                                <TableHead className="text-right">ARIMA</TableHead>
                                <TableHead className="text-right">LSTM</TableHead>
                                <TableHead className="text-right">Selisih</TableHead>
                                {/* <TableHead>Akurasi</TableHead> */}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {
                                is_loading_comparisons ? (
                                  <p>Loading...</p>
                                ) : (
                                  data_total['predictions'].slice(0, 7).map((result, index) => (
                                    <TableRow key={index} className="hover:bg-muted/50">
                                      <TableCell className="font-medium">{index+1}</TableCell>
                                      <TableCell>{(new Date(result['date'])).toLocaleString('id-ID', { day: 'numeric', month: 'numeric', year: 'numeric' })}</TableCell>
                                      <TableCell className="text-right font-mono">
                                        {formatCurrency(result["ARIMA"]["value"])}
                                      </TableCell>
                                      <TableCell className="text-right font-mono font-semibold text-lstm">
                                        {formatCurrency(result["LSTM"]["value"])}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {formatCurrency(Math.abs(result["ARIMA"]["value"] - result["LSTM"]["value"]))}
                                      </TableCell>
                                      {/* <TableCell>
                                        <Badge className="bg-success/10 text-success border-success/20">
                                        {result.accuracy}
                                        </Badge>
                                      </TableCell> */}
                                    </TableRow>
                                  ))
                                )
                              }
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>

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
                              <p>
                                Loading...
                              </p>
                            ) : (
                              <>
                                {/* MAE */}
                                <div className="p-4 bg-muted/20 rounded-lg">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium">{metric[0]}</span>
                                    {Number(data_metrics.data.arima_mae) > Number(data_metrics.data.lstm_mae) ? (
                                      <Badge className="bg-lstm/10 text-lstm border-lstm/20">
                                        LSTM Unggul
                                      </Badge>
                                    ) : (
                                      <Badge className="bg-arima/10 text-arima border-arima/20">
                                        ARIMA Unggul
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 bg-arima/5 border border-arima/20 rounded">
                                      <div className="text-lg font-semibold text-arima">
                                        {formatNumberId(data_metrics.data.arima_mae)}
                                      </div>
                                      <div className="text-xs text-muted-foreground">ARIMA</div>
                                    </div>
                                    <div className="text-center p-3 bg-lstm/5 border border-lstm/20 rounded">
                                      <div className="text-lg font-semibold text-lstm">
                                        {formatNumberId(data_metrics.data.lstm_mae)}
                                      </div>
                                      <div className="text-xs text-muted-foreground">LSTM</div>
                                    </div>
                                  </div>
                                </div>

                                {/* RMSE */}
                                <div className="p-4 bg-muted/20 rounded-lg">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium">{metric[1]}</span>
                                    {Number(data_metrics.data.arima_rmse) > Number(data_metrics.data.lstm_rmse) ? (
                                      <Badge className="bg-lstm/10 text-lstm border-lstm/20">
                                        LSTM Unggul
                                      </Badge>
                                    ) : (
                                      <Badge className="bg-arima/10 text-arima border-arima/20">
                                        ARIMA Unggul
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 bg-arima/5 border border-arima/20 rounded">
                                      <div className="text-lg font-semibold text-arima">
                                        {formatNumber(data_metrics.data.arima_rmse)}
                                      </div>
                                      <div className="text-xs text-muted-foreground">ARIMA</div>
                                    </div>
                                    <div className="text-center p-3 bg-lstm/5 border border-lstm/20 rounded">
                                      <div className="text-lg font-semibold text-lstm">
                                        {formatNumber(data_metrics.data.lstm_rmse)}
                                      </div>
                                      <div className="text-xs text-muted-foreground">LSTM</div>
                                    </div>
                                  </div>
                                </div>

                                {/* Waktu Train */}
                                <div className="p-4 bg-muted/20 rounded-lg">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium">{metric[2]}</span>
                                    {Number(data_metrics.data.arima_waktu_train) > Number(data_metrics.data.lstm_waktu_train) ? (
                                      <Badge className="bg-lstm/10 text-lstm border-lstm/20">
                                        LSTM Unggul
                                      </Badge>
                                    ) : (
                                      <Badge className="bg-arima/10 text-arima border-arima/20">
                                        ARIMA Unggul
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 bg-arima/5 border border-arima/20 rounded">
                                      <div className="text-lg font-semibold text-arima">
                                        {formatNumber(data_metrics.data.arima_waktu_train)} detik
                                      </div>
                                      <div className="text-xs text-muted-foreground">ARIMA</div>
                                    </div>
                                    <div className="text-center p-3 bg-lstm/5 border border-lstm/20 rounded">
                                      <div className="text-lg font-semibold text-lstm">
                                        {formatNumber(data_metrics.data.lstm_waktu_train)} detik
                                      </div>
                                      <div className="text-xs text-muted-foreground">LSTM</div>
                                    </div>
                                  </div>
                                </div>

                                {/* Memori */}
                                <div className="p-4 bg-muted/20 rounded-lg">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium">{metric[3]}</span>
                                    {Number(data_metrics.data.arima_memori) > Number(data_metrics.data.lstm_memori) ? (
                                      <Badge className="bg-lstm/10 text-lstm border-lstm/20">
                                        LSTM Unggul
                                      </Badge>
                                    ) : (
                                      <Badge className="bg-arima/10 text-arima border-arima/20">
                                        ARIMA Unggul
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 bg-arima/5 border border-arima/20 rounded">
                                      <div className="text-lg font-semibold text-arima">
                                        {formatNumber(data_metrics.data.arima_memori)} MB
                                      </div>
                                      <div className="text-xs text-muted-foreground">ARIMA</div>
                                    </div>
                                    <div className="text-center p-3 bg-lstm/5 border border-lstm/20 rounded">
                                      <div className="text-lg font-semibold text-lstm">
                                        {formatNumber(data_metrics.data.lstm_memori)} MB
                                      </div>
                                      <div className="text-xs text-muted-foreground">LSTM</div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )
                          }
                          {/* {data_metrics.data.map((item, index) => (
                            <div key={index} className="p-4 bg-muted/20 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">{metric[index]}</span>
                                {item.better === 'lstm' ? (
                                  <Badge className="bg-lstm/10 text-lstm border-lstm/20">
                                  LSTM Unggul
                                  </Badge>
                                  ) : (
                                    <Badge className="bg-arima/10 text-arima border-arima/20">
                                    ARIMA Unggul
                                    </Badge>
                                    )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 bg-arima/5 border border-arima/20 rounded">
                                    <div className="text-lg font-semibold text-arima">
                                    {item.arima} {item.unit}
                                    </div>
                                    <div className="text-xs text-muted-foreground">ARIMA</div>
                                    </div>
                                    <div className="text-center p-3 bg-lstm/5 border border-lstm/20 rounded">
                                    <div className="text-lg font-semibold text-lstm">
                                    {item.lstm} {item.unit}
                                    </div>
                                    <div className="text-xs text-muted-foreground">LSTM</div>
                                    </div>
                                    </div>
                                    </div>
                                    ))} */}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  </>
                )
              }
            </>
          } 
      </div>
    </div>
  );
};