import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, ArrowLeft, Database, Brain, TrendingUp, Calendar, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const UserInfo = () => {
  const navigate = useNavigate();

  const datasetInfo = {
    period: "Mei 2020 - September 2024",
    totalTransactions: "32,570",
    columns: [
      "Invoice - ID unik setiap transaksi",
      "Tanggal Pembayaran - Timestamp lengkap transaksi",
      "Status Terakhir - Status penyelesaian pesanan",
      "Nama Produk - Deskripsi detail produk",
      "Jumlah Produk Dibeli - Kuantitas item per transaksi",
      "Harga Jual (IDR) - Harga per unit dalam Rupiah",
      "Total Penjualan (IDR) - Nilai total transaksi"
    ],
    preprocessing: [
      "Data telah dibersihkan dari missing values (0% missing)",
      "Duplikasi data telah dihilangkan (0% duplicates)",
      "Format tanggal telah distandarisasi",
      "Outliers telah diidentifikasi dan ditangani",
      "Data sudah siap untuk training model ML"
    ]
  };

  const modelAccuracy = [
    { model: "LSTM", accuracy: "96.8%", mae: "0.0026", rmse: "0.0106" },
    { model: "ARIMA", accuracy: "94.2%", mae: "861.40", rmse: "861.40" }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/user-dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Dashboard
          </Button>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Informasi <span className="bg-gradient-ml bg-clip-text text-transparent">Prediksi</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Detail lengkap tentang dataset dan metodologi prediksi yang digunakan
          </p>
        </div>

        {/* Dataset Overview */}
        <Card className="shadow-neural border-ml-primary/20 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-ml-primary" />
              Informasi Dataset
            </CardTitle>
            <CardDescription>
              Detail lengkap tentang data yang digunakan untuk training model prediksi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-ml-accent" />
                    Periode Data
                  </h4>
                  <p className="text-sm text-muted-foreground mb-1">{datasetInfo.period}</p>
                  <p className="text-sm text-muted-foreground">Total: {datasetInfo.totalTransactions} transaksi</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Kualitas Data</h4>
                  <div className="space-y-2">
                    {datasetInfo.preprocessing.map((item, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Kolom Dataset</h4>
                  <div className="space-y-2">
                    {datasetInfo.columns.map((column, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium text-ml-primary">
                          {column.split(' - ')[0]}
                        </span>
                        <span className="text-muted-foreground">
                          {' - ' + column.split(' - ')[1]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Model Performance */}
        <Card className="shadow-neural border-ml-primary/20 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-ml-primary" />
              Performa Model Machine Learning
            </CardTitle>
            <CardDescription>
              Tingkat akurasi dan metrik evaluasi model prediksi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {modelAccuracy.map((model, index) => (
                <div key={index} className="p-6 bg-muted/20 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-bold">{model.model}</h4>
                    <Badge className={`text-lg px-3 py-1 ${
                      model.model === 'LSTM' 
                        ? 'bg-lstm/10 text-lstm border-lstm/20' 
                        : 'bg-arima/10 text-arima border-arima/20'
                    }`}>
                      {model.accuracy}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Mean Absolute Error (MAE):</span>
                      <span className="font-medium">{model.mae}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Root Mean Square Error (RMSE):</span>
                      <span className="font-medium">{model.rmse}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {model.model === 'LSTM' 
                        ? 'Terbaik untuk prediksi jangka pendek dengan pola temporal kompleks'
                        : 'Cocok untuk data dengan pola musiman dan tren linear'
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Methodology */}
        <Card className="shadow-neural border-ml-primary/20 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-ml-primary" />
              Metodologi Prediksi
            </CardTitle>
            <CardDescription>
              Penjelasan teknis tentang bagaimana prediksi dibuat
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-lstm">Model LSTM (Long Short-Term Memory)</h4>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>• Neural network khusus untuk data time series</p>
                  <p>• Mampu menangkap pola temporal jangka panjang</p>
                  <p>• Cocok untuk data dengan seasonal patterns</p>
                  <p>• Training menggunakan 30 hari data sebelumnya</p>
                  <p>• Optimized dengan SGD optimizer</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-arima">Model ARIMA (AutoRegressive Integrated Moving Average)</h4>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>• Model statistik klasik untuk time series</p>
                  <p>• Berdasarkan pola autoregressive dan moving average</p>
                  <p>• Parameter (p=1, d=1, q=1) optimal untuk data ini</p>
                  <p>• Cocok untuk data dengan tren linear</p>
                  <p>• Interpretasi hasil lebih mudah dipahami</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Guidelines */}
        <Card className="shadow-neural border-ml-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-ml-primary" />
              Panduan Penggunaan Prediksi
            </CardTitle>
            <CardDescription>
              Cara optimal menggunakan hasil prediksi untuk bisnis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-success">Rekomendasi Penggunaan</h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                    <p className="text-sm">Gunakan prediksi LSTM untuk perencanaan 1-7 hari</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                    <p className="text-sm">Monitor confidence interval ±5% untuk akurasi optimal</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                    <p className="text-sm">Update model setiap minggu dengan data terbaru</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                    <p className="text-sm">Kombinasikan dengan analisis pasar untuk hasil terbaik</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-warning">Limitasi</h4>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>• Prediksi didasarkan pada pola historis, tidak memprediksi event eksternal</p>
                  <p>• Akurasi menurun untuk prediksi jangka panjang (&gt;30 hari)</p>
                  <p>• Perlu adjustment untuk periode dengan seasonal variations</p>
                  <p>• Model tidak memperhitungkan faktor ekonomi makro</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};