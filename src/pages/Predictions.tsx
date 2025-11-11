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
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PredictionComparisonBase, usePredictionComparisons, usePredictionMetrics, useTotalPredictions } from "@/hooks/usePredictions";
import * as XLSX from "xlsx";
import { useAuthNamaToko } from "@/store/AuthStore";

export const Predictions = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: data_total, isLoading: is_loading_total, isError: is_error_total } = useTotalPredictions();
  const { data: data_comparisons, isLoading: is_loading_comparisons, isError: is_error_comparisons } = usePredictionComparisons();
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
    const totalSheetData = data_total.data.map((item: any, index: number) => ({
      No: index + 1,
      Tanggal: new Date(item.hasil_tanggal).toLocaleDateString("id-ID"),
      "Total Penjualan ARIMA": item.hasil_total_penjualan_arima,
      "Total Penjualan LSTM": item.hasil_total_penjualan_lstm,
      "Selisih": Math.abs(item.hasil_total_penjualan_arima - item.hasil_total_penjualan_lstm)
    }));
    const totalSheet = XLSX.utils.json_to_sheet(totalSheetData);

    // 2️⃣ Prediction Comparisons Sheet
    const comparisonSheetData = data_comparisons.data.map((item: PredictionComparisonBase) => ({
      Hari: item.hari,
      Aktual: item.hasil_total_penjualan_aktual,
      ARIMA: item.hasil_total_penjualan_arima,
      LSTM: item.hasil_total_penjualan_lstm,
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
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
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

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button 
            variant="ml" 
            onClick={handleGeneratePrediction}
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Generate New Prediction
              </>
            )}
          </Button>
          <Button variant="outline" className="border-ml-primary/30 hover:bg-ml-primary/10" onClick={handleExportExcel}>
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
        </div>

        {/* Performance Metrics */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Best Model"
            value="LSTM"
            change="96.8% accuracy"
            changeType="positive"
            icon={<BrainCircuit className="h-4 w-4 text-lstm" />}
            gradient
          />
          <MetricCard
            title="Avg. Prediction"
            value={formatCurrency(218950)}
            change="Next 7 days"
            changeType="neutral"
            icon={<TrendingUp className="h-4 w-4 text-ml-primary" />}
          />
          <MetricCard
            title="Model Accuracy"
            value="96.8%"
            change="+2.3% improvement"
            changeType="positive"
            icon={<Target className="h-4 w-4 text-success" />}
          />
          <MetricCard
            title="Predictions Made"
            value="1,847"
            description="Total predictions"
            icon={<BarChart3 className="h-4 w-4 text-ml-accent" />}
          />
        </div> */}

        {/* Prediction Chart */}
        <div className="mb-8">
          {
            !is_loading_comparisons && <PredictionChart data={data_comparisons.data} />
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
                        data_total?.data?.slice(0, 7).map((result, index) => (
                          <TableRow key={index} className="hover:bg-muted/50">
                            <TableCell className="font-medium">{index+1}</TableCell>
                            <TableCell>{(new Date(result.hasil_tanggal)).toLocaleString('id-ID', { day: 'numeric', month: 'numeric', year: 'numeric' })}</TableCell>
                            <TableCell className="text-right font-mono">
                              {formatCurrency(result.hasil_total_penjualan_arima)}
                            </TableCell>
                            <TableCell className="text-right font-mono font-semibold text-lstm">
                              {formatCurrency(result.hasil_total_penjualan_lstm)}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(Math.abs(result.hasil_total_penjualan_arima - result.hasil_total_penjualan_lstm))}
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
                              {formatNumber(data_metrics.data.arima_mae)}
                            </div>
                            <div className="text-xs text-muted-foreground">ARIMA</div>
                          </div>
                          <div className="text-center p-3 bg-lstm/5 border border-lstm/20 rounded">
                            <div className="text-lg font-semibold text-lstm">
                              {formatNumber(data_metrics.data.lstm_mae)}
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

        {/* Summary Insights */}
        <Card className="mt-8 shadow-neural border-ml-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-ml-accent" />
              Kesimpulan & Rekomendasi
            </CardTitle>
            <CardDescription>
              Analisis hasil prediksi dan saran optimalisasi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-success mb-3">Temuan Utama</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-success mt-2"></div>
                    <span>Model LSTM menunjukkan performa superior dengan akurasi 96.8%</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-success mt-2"></div>
                    <span>Pola penjualan menunjukkan tren yang stabil dengan fluktuasi minimal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-success mt-2"></div>
                    <span>Prediksi 7 hari kedepan memiliki confidence interval tinggi</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-ml-primary mb-3">Rekomendasi</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-ml-primary mt-2"></div>
                    <span>Gunakan model LSTM sebagai prediksi utama untuk akurasi maksimal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-ml-primary mt-2"></div>
                    <span>Monitor performance model setiap minggu untuk deteksi drift</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-ml-primary mt-2"></div>
                    <span>Pertimbangkan ensemble model untuk prediksi jangka panjang</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};