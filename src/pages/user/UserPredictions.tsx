import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, Package, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const UserPredictions = () => {
  const navigate = useNavigate();

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
            Prediksi <span className="bg-gradient-ml bg-clip-text text-transparent">Penjualan</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Estimasi penjualan produk berdasarkan model machine learning LSTM
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 7 Days Prediction */}
          <Card className="shadow-neural border-ml-primary/20">
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

          {/* 30 Days Prediction */}
          <Card className="shadow-neural border-ml-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-ml-primary" />
                Prediksi 30 Hari Mendatang
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
        </div>

        {/* Model Info */}
        <Card className="shadow-neural border-ml-primary/20 mt-8">
          <CardHeader>
            <CardTitle>Informasi Model Prediksi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <TrendingUp className="h-8 w-8 text-ml-primary mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Model LSTM</h4>
                <p className="text-sm text-muted-foreground">Akurasi: 96.8%</p>
              </div>
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <Calendar className="h-8 w-8 text-ml-accent mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Update Terakhir</h4>
                <p className="text-sm text-muted-foreground">2 jam yang lalu</p>
              </div>
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <Package className="h-8 w-8 text-success mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Confidence Level</h4>
                <p className="text-sm text-muted-foreground">95% ± 5%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};