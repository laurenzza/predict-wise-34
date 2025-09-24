import { Navbar } from "@/components/layout/Navbar";
import { MetricCard } from "@/components/cards/MetricCard";
import { PredictionChart } from "@/components/charts/PredictionChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BrainCircuit, 
  TrendingUp, 
  Target, 
  Database, 
  Activity,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock
} from "lucide-react";

export const AdminDashboard = () => {
  const recentPredictions = [
    { date: "2024-09-24", arima: 220215, lstm: 218500, status: "Completed" },
    { date: "2024-09-23", arima: 219800, lstm: 218200, status: "Completed" },
    { date: "2024-09-22", arima: 219500, lstm: 217950, status: "Processing" },
    { date: "2024-09-21", arima: 219200, lstm: 217700, status: "Completed" },
  ];

  const modelPerformance = [
    { metric: "MAE", arima: "861.40", lstm: "0.0026", better: "lstm" },
    { metric: "RMSE", arima: "861.40", lstm: "0.0106", better: "lstm" },
    { metric: "Accuracy", arima: "94.2%", lstm: "96.8%", better: "lstm" },
    { metric: "Training Time", arima: "2.3s", lstm: "45.2s", better: "arima" },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Dashboard <span className="bg-gradient-ml bg-clip-text text-transparent">Admin</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Monitoring dan analisis performa model ARIMA vs LSTM untuk prediksi penjualan
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Model Terbaik"
            value="LSTM"
            change="96.8% akurasi"
            changeType="positive"
            icon={<BrainCircuit className="h-4 w-4 text-lstm" />}
            gradient
          />
          <MetricCard
            title="Prediksi Hari Ini"
            value={formatCurrency(220215)}
            change="+2.1% dari kemarin"
            changeType="positive"
            icon={<TrendingUp className="h-4 w-4 text-ml-primary" />}
          />
          <MetricCard
            title="Data Training"
            value="32,570"
            description="Total transaksi"
            icon={<Database className="h-4 w-4 text-ml-accent" />}
          />
          <MetricCard
            title="Model Status"
            value="Active"
            change="Terakhir update: 2 jam lalu"
            changeType="positive"
            icon={<Activity className="h-4 w-4 text-success" />}
          />
        </div>

        {/* Main Chart */}
        <div className="mb-8">
          <PredictionChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Predictions */}
          <Card className="shadow-neural border-ml-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-ml-primary" />
                Prediksi Terbaru
              </CardTitle>
              <CardDescription>
                History prediksi 7 hari terakhir
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPredictions.map((pred, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                    <div>
                      <p className="font-medium">{pred.date}</p>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>ARIMA: {formatCurrency(pred.arima)}</p>
                        <p>LSTM: {formatCurrency(pred.lstm)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {pred.status === "Completed" ? (
                        <Badge className="bg-success/10 text-success border-success/20">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Selesai
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <Clock className="h-3 w-3 mr-1" />
                          Proses
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Model Performance Comparison */}
          <Card className="shadow-neural border-ml-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-ml-primary" />
                Perbandingan Performa Model
              </CardTitle>
              <CardDescription>
                Metrik evaluasi ARIMA vs LSTM
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modelPerformance.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                    <div className="font-medium">{metric.metric}</div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className={`text-sm ${metric.better === 'arima' ? 'font-semibold text-arima' : 'text-muted-foreground'}`}>
                          ARIMA: {metric.arima}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm ${metric.better === 'lstm' ? 'font-semibold text-lstm' : 'text-muted-foreground'}`}>
                          LSTM: {metric.lstm}
                        </div>
                      </div>
                      {metric.better === 'lstm' ? (
                        <Badge className="bg-lstm/10 text-lstm border-lstm/20">
                          LSTM
                        </Badge>
                      ) : (
                        <Badge className="bg-arima/10 text-arima border-arima/20">
                          ARIMA
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Insights & Recommendations */}
          <Card className="shadow-neural border-ml-primary/20 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-ml-accent" />
                Insights & Rekomendasi
              </CardTitle>
              <CardDescription>
                Analisis otomatis dari model machine learning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-success">Hasil Positif</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <p className="text-sm">Model LSTM menunjukkan akurasi 96.8% dengan error rate rendah</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <p className="text-sm">Tren penjualan menunjukkan stabilitas dalam 30 hari terakhir</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <p className="text-sm">Dataset memiliki kualitas tinggi dengan 0% missing values</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-warning">Rekomendasi</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                      <p className="text-sm">Gunakan model LSTM untuk prediksi jangka pendek (1-7 hari)</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                      <p className="text-sm">Monitor performa model setiap minggu untuk akurasi optimal</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                      <p className="text-sm">Pertimbangkan retrain model jika akurasi turun di bawah 95%</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};