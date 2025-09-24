import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, TrendingUp, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const UserPeriod = () => {
  const navigate = useNavigate();

  const periods = [
    { 
      title: "Analisis Harian", 
      description: "Prediksi untuk 1-7 hari ke depan", 
      accuracy: "96.8%",
      bestFor: "Perencanaan operasional harian"
    },
    { 
      title: "Analisis Mingguan", 
      description: "Prediksi untuk 1-4 minggu ke depan", 
      accuracy: "94.5%",
      bestFor: "Perencanaan inventori mingguan"
    },
    { 
      title: "Analisis Bulanan", 
      description: "Prediksi untuk 1-3 bulan ke depan", 
      accuracy: "89.2%",
      bestFor: "Perencanaan strategis jangka menengah"
    },
  ];

  const dataRange = {
    start: "Mei 2020",
    end: "September 2024",
    totalDays: "1,582 hari",
    totalTransactions: "32,570 transaksi"
  };

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
            Periode <span className="bg-gradient-ml bg-clip-text text-transparent">Analisis</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Pilih periode waktu untuk analisis prediksi penjualan
          </p>
        </div>

        {/* Period Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {periods.map((period, index) => (
            <Card key={index} className="shadow-neural border-ml-primary/20 hover:shadow-ml transition-all cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-ml-primary" />
                  {period.title}
                </CardTitle>
                <CardDescription>{period.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Akurasi:</span>
                    <span className="font-semibold text-success">{period.accuracy}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <strong>Terbaik untuk:</strong> {period.bestFor}
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    variant="outline"
                    onClick={() => navigate('/user/predictions')}
                  >
                    Pilih Periode
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Data Range Information */}
        <Card className="shadow-neural border-ml-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-ml-primary" />
              Rentang Data Training
            </CardTitle>
            <CardDescription>
              Informasi periode data yang digunakan untuk pelatihan model
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <Calendar className="h-8 w-8 text-ml-accent mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Mulai</h4>
                <p className="text-sm text-muted-foreground">{dataRange.start}</p>
              </div>
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <Calendar className="h-8 w-8 text-ml-accent mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Berakhir</h4>
                <p className="text-sm text-muted-foreground">{dataRange.end}</p>
              </div>
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <TrendingUp className="h-8 w-8 text-ml-accent mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Total Hari</h4>
                <p className="text-sm text-muted-foreground">{dataRange.totalDays}</p>
              </div>
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <BarChart3 className="h-8 w-8 text-ml-accent mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Total Transaksi</h4>
                <p className="text-sm text-muted-foreground">{dataRange.totalTransactions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Model Performance by Period */}
        <Card className="shadow-neural border-ml-primary/20 mt-8">
          <CardHeader>
            <CardTitle>Performa Model Berdasarkan Periode</CardTitle>
            <CardDescription>
              Tingkat akurasi model LSTM untuk berbagai rentang waktu prediksi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                <div>
                  <h4 className="font-medium">Prediksi 1-7 Hari</h4>
                  <p className="text-sm text-muted-foreground">Akurasi tertinggi untuk prediksi jangka pendek</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-success">96.8%</div>
                  <div className="text-sm text-muted-foreground">MAE: 0.0026</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                <div>
                  <h4 className="font-medium">Prediksi 8-30 Hari</h4>
                  <p className="text-sm text-muted-foreground">Akurasi baik untuk perencanaan bulanan</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-success">94.5%</div>
                  <div className="text-sm text-muted-foreground">MAE: 0.0038</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                <div>
                  <h4 className="font-medium">Prediksi 31-90 Hari</h4>
                  <p className="text-sm text-muted-foreground">Akurasi moderat untuk tren jangka menengah</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-warning">89.2%</div>
                  <div className="text-sm text-muted-foreground">MAE: 0.0055</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};