import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowLeft, TrendingUp, BarChart3, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const UserPeriod = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | null>(null);

  const periods = [
    { 
      id: 'daily' as const,
      title: "Analisis Harian", 
      description: "Prediksi untuk 1-7 hari ke depan", 
      accuracy: "96.8%",
      bestFor: "Perencanaan operasional harian"
    },
    { 
      id: 'weekly' as const,
      title: "Analisis Mingguan", 
      description: "Prediksi untuk 1-4 minggu ke depan", 
      accuracy: "94.5%",
      bestFor: "Perencanaan inventori mingguan"
    },
    { 
      id: 'monthly' as const,
      title: "Analisis Bulanan", 
      description: "Prediksi untuk 1-3 bulan ke depan", 
      accuracy: "89.2%",
      bestFor: "Perencanaan strategis jangka menengah"
    },
  ];

  const predictions7Days = [
    { day: 1, products: ["Kapasitor 1.5UF 450V", "AS Dinamo Kipas Angin"], sales: "Rp 215,000" },
    { day: 2, products: ["Bushing Bearing Kipas", "Kapasitor 2UF"], sales: "Rp 230,000" },
    { day: 3, products: ["AS Exsos Kipas Lobang 2", "Kapasitor Pompa Air"], sales: "Rp 205,000" },
    { day: 4, products: ["Kapasitor 1.2UF 450V", "AS Dinamo Model Cosmos"], sales: "Rp 220,000" },
    { day: 5, products: ["Kapasitor 2.5UF Kotak", "Bushing Kipas Angin"], sales: "Rp 240,000" },
    { day: 6, products: ["AS Dinamo Miyako", "Kapasitor 16UF"], sales: "Rp 235,000" },
    { day: 7, products: ["Kapasitor Pompa 20UF", "AS Exsos Model Maspion"], sales: "Rp 225,000" },
  ];

  const predictions30Days = [
    { week: "Minggu 1", products: ["Kapasitor 1.5UF", "AS Dinamo Kipas", "Bushing Bearing"], sales: "Rp 1,570,000" },
    { week: "Minggu 2", products: ["Kapasitor 2UF", "AS Exsos Kipas", "Kapasitor Pompa"], sales: "Rp 1,620,000" },
    { week: "Minggu 3", products: ["Kapasitor 1.2UF", "AS Dinamo Cosmos", "Bushing Kipas"], sales: "Rp 1,580,000" },
    { week: "Minggu 4", products: ["Kapasitor 2.5UF", "AS Dinamo Miyako", "Kapasitor 16UF"], sales: "Rp 1,650,000" },
  ];

  const predictions90Days = [
    { month: "Bulan 1", products: ["Kapasitor 1.5UF", "AS Dinamo", "Bushing"], sales: "Rp 6,420,000" },
    { month: "Bulan 2", products: ["Kapasitor 2UF", "AS Exsos", "Kipas Angin"], sales: "Rp 6,180,000" },
    { month: "Bulan 3", products: ["Kapasitor Pompa", "AS Dinamo Miyako", "Bearing"], sales: "Rp 6,540,000" },
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
            onClick={() => navigate(-1)}
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
            <Card 
              key={index} 
              className={`shadow-neural border-ml-primary/20 hover:shadow-ml transition-all cursor-pointer ${
                selectedPeriod === period.id ? 'ring-2 ring-ml-primary bg-ml-primary/5' : ''
              }`}
              onClick={() => setSelectedPeriod(period.id)}
            >
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
                    variant={selectedPeriod === period.id ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPeriod(period.id);
                    }}
                  >
                    {selectedPeriod === period.id ? 'Terpilih' : 'Pilih Periode'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Predictions Display based on selected period */}
        {selectedPeriod === 'daily' && (
          <Card className="shadow-neural border-ml-primary/20 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-ml-primary" />
                Prediksi 7 Hari Mendatang
              </CardTitle>
              <CardDescription>
                Estimasi harian dengan produk yang diprediksi akan terjual
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictions7Days.map((pred, index) => (
                  <div key={index} className="p-4 bg-muted/20 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium">Hari {pred.day}</h4>
                      <Badge className="bg-ml-primary/10 text-ml-primary border-ml-primary/20">
                        {pred.sales}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Produk Teratas:</p>
                      {pred.products.map((product, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm">
                          <Package className="h-3 w-3 text-ml-accent" />
                          <span>{product}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Estimasi 7 Hari:</span>
                    <Badge variant="secondary" className="text-lg">
                      Rp 1,570,000
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedPeriod === 'weekly' && (
          <>
            <Card className="shadow-neural border-ml-primary/20 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-ml-primary" />
                  Hasil Prediksi 30 Hari Mendatang
                </CardTitle>
                <CardDescription>
                  Estimasi mingguan untuk perencanaan inventori
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {predictions30Days.map((pred, index) => (
                    <div key={index} className="p-4 bg-muted/20 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium">{pred.week}</h4>
                        <Badge className="bg-lstm/10 text-lstm border-lstm/20">
                          {pred.sales}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Kategori Produk Utama:</p>
                        {pred.products.map((product, idx) => (
                          <div key={idx} className="flex items-center space-x-2 text-sm">
                            <Package className="h-3 w-3 text-ml-accent" />
                            <span>{product}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Estimasi 30 Hari:</span>
                      <Badge variant="secondary" className="text-lg">
                        Rp 6,420,000
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {selectedPeriod === 'monthly' && (
          <Card className="shadow-neural border-ml-primary/20 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-ml-primary" />
                Prediksi 90 Hari Mendatang
              </CardTitle>
              <CardDescription>
                Estimasi bulanan untuk perencanaan strategis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictions90Days.map((pred, index) => (
                  <div key={index} className="p-4 bg-muted/20 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium">{pred.month}</h4>
                      <Badge className="bg-arima/10 text-arima border-arima/20">
                        {pred.sales}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Kategori Produk Utama:</p>
                      {pred.products.map((product, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm">
                          <Package className="h-3 w-3 text-ml-accent" />
                          <span>{product}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Estimasi 90 Hari:</span>
                    <Badge variant="secondary" className="text-lg">
                      Rp 19,140,000
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
      </div>
    </div>
  );
};