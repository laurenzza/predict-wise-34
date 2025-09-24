import { useState } from "react";
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
  BarChart3
} from "lucide-react";

export const Predictions = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const predictionResults = [
    { day: "Hari 1", date: "2024-09-25", arima: 220215, lstm: 218500, difference: 1715, accuracy: "96.8%" },
    { day: "Hari 2", date: "2024-09-26", arima: 220131, lstm: 218200, difference: 1931, accuracy: "96.5%" },
    { day: "Hari 3", date: "2024-09-27", arima: 219943, lstm: 217950, difference: 1993, accuracy: "96.7%" },
    { day: "Hari 4", date: "2024-09-28", arima: 219676, lstm: 217700, difference: 1976, accuracy: "96.4%" },
    { day: "Hari 5", date: "2024-09-29", arima: 219364, lstm: 217450, difference: 1914, accuracy: "96.9%" },
    { day: "Hari 6", date: "2024-09-30", arima: 218986, lstm: 217200, difference: 1786, accuracy: "96.6%" },
    { day: "Hari 7", date: "2024-10-01", arima: 218831, lstm: 216950, difference: 1881, accuracy: "96.8%" },
  ];

  const modelComparison = [
    { metric: "Mean Absolute Error (MAE)", arima: "861.40", lstm: "0.0026", unit: "", better: "lstm" },
    { metric: "Root Mean Squared Error (RMSE)", arima: "861.40", lstm: "0.0106", unit: "", better: "lstm" },
    { metric: "Akurasi Prediksi", arima: "94.2%", lstm: "96.8%", unit: "", better: "lstm" },
    { metric: "Training Time", arima: "2.3", lstm: "45.2", unit: "detik", better: "arima" },
    { metric: "Memory Usage", arima: "124", lstm: "892", unit: "MB", better: "arima" },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleGeneratePrediction = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
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
          <Button variant="outline" className="border-ml-primary/30 hover:bg-ml-primary/10">
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        </div>

        {/* Prediction Chart */}
        <div className="mb-8">
          <PredictionChart />
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
                      <TableHead>Akurasi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {predictionResults.map((result, index) => (
                      <TableRow key={index} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{result.day}</TableCell>
                        <TableCell>{result.date}</TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(result.arima)}
                        </TableCell>
                        <TableCell className="text-right font-mono font-semibold text-lstm">
                          {formatCurrency(result.lstm)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(result.difference)}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-success/10 text-success border-success/20">
                            {result.accuracy}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
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
                {modelComparison.map((item, index) => (
                  <div key={index} className="p-4 bg-muted/20 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{item.metric}</span>
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
                ))}
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