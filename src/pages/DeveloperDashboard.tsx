import { Navbar } from "@/components/layout/Navbar";
import { MetricCard } from "@/components/cards/MetricCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Calendar, 
  Database, 
  Package,
  BarChart3,
  Info,
  Clock,
  ArrowRight,
  Brain
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const DeveloperDashboard = () => {
  const navigate = useNavigate();

  const upcomingPredictions = [
    { 
      period: "7 Hari Mendatang", 
      products: ["Kapasitor 1.5UF", "AS Dinamo Kipas Angin", "Bushing Bearing"], 
      totalSales: "Rp 1,580,000" 
    },
    { 
      period: "30 Hari Mendatang", 
      products: ["Kapasitor 2UF", "AS Exsos Kipas", "Kapasitor Pompa Air"], 
      totalSales: "Rp 6,420,000" 
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Dashboard <span className="bg-gradient-ml bg-clip-text text-transparent">Developer</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Analisis mendalam model prediksi dan kualitas data untuk Toko Loa Kim Jong
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Prediksi Hari Ini"
            value="Rp 220,215"
            change="+2.1% dari kemarin"
            changeType="positive"
            icon={<TrendingUp className="h-4 w-4 text-ml-primary" />}
            gradient
          />
          <MetricCard
            title="Total Produk"
            value="156"
            description="Kategori tersedia"
            icon={<Package className="h-4 w-4 text-ml-accent" />}
          />
          <MetricCard
            title="Data Points"
            value="32,570"
            description="Total transaksi"
            icon={<Database className="h-4 w-4 text-ml-accent" />}
          />
          <MetricCard
            title="Akurasi Model"
            value="96.8%"
            change="LSTM Model"
            changeType="positive"
            icon={<BarChart3 className="h-4 w-4 text-success" />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 mb-8">
          {/* Quick Actions */}
          <Card className="shadow-neural border-ml-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-ml-primary" />
                Menu Utama
              </CardTitle>
              <CardDescription>
                Akses cepat ke fitur prediksi dan analisis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                <Button 
                  variant="outline" 
                  className="justify-between h-12"
                  onClick={() => navigate('/user/period')}
                >
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Prediksi Penjualan</span>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  className="justify-between h-12"
                  onClick={() => navigate('/user/statistics')}
                >
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>Dataset & Statistik</span>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <Button 
                  variant="outline" 
                  className="justify-between h-12"
                  onClick={() => navigate('/predictions')}
                >
                  <div className="flex items-center space-x-2">
                    <Brain className="h-4 w-4" />
                    <span>Informasi Prediksi</span>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <Button 
                  variant="outline" 
                  className="justify-between h-12"
                  onClick={() => navigate('/user/top-products')}
                >
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Produk Terlaris</span>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="shadow-neural border-ml-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-ml-primary" />
              Informasi Model & Dataset
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <Clock className="h-8 w-8 text-ml-accent mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Periode Data</h4>
                <p className="text-sm text-muted-foreground">Mei 2020 - September 2024</p>
              </div>
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <Database className="h-8 w-8 text-ml-accent mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Total Transaksi</h4>
                <p className="text-sm text-muted-foreground">32,570 Data Points</p>
              </div>
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <Brain className="h-8 w-8 text-success mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Model Terbaik</h4>
                <p className="text-sm text-muted-foreground">LSTM (96.8% akurasi)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
