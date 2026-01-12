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
  Brain,
  Hourglass
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthId, useAuthNamaToko, useAuthRole, useAuthToken } from "@/store/AuthStore";
import { useDataSummary, useFormatDate, useSummarizeData } from "@/store/DataSummaryStore";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSingleDayPrediction } from "@/hooks/usePredictions";

export const UserDashboard = () => {
  const navigate = useNavigate();

  const role = useAuthRole();
  const namaToko = useAuthNamaToko();
  const userId = useAuthId();
  const token = useAuthToken();

  const summarize_data = useSummarizeData();
  const { data, isLoading, isError } = useQuery({
      queryKey: ["data_summary"],
      queryFn: () => summarize_data(userId, token)
  })
  const ds = useDataSummary();
  const format_date = useFormatDate();

  const date = new Date();
  const today: string = date.toISOString().split('T')[0];
  date.setDate(date.getDate() - 1);
  const yesterday: string = date.toISOString().split('T')[0];
  const { data: predictionToday, isLoading: isLoadingPredictionToday, error: predictionErrorToday } = useSingleDayPrediction(today);
  const { data: predictionYesterday, isLoading: isLoadingPredictionYesterday, error: predictionErrorYesterday } = useSingleDayPrediction(yesterday);

  const getChange = (today: number, yesterday: number) => {
    const result = ((today-yesterday)/yesterday)*100;
    return {
      percent: Math.abs(result).toFixed(2),
      isPositive: result > 0 ? 1 : result < 0 ? 2 : 0,
    };
  }

  const getDurationText = (startStr: string, endStr: string) => {
    const startDate = new Date(startStr);
    const endDate = new Date(endStr);

    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();

    // Koreksi jika bulan negatif (misal: Jan 2024 - Des 2022)
    if (months < 0) {
      years--;
      months += 12;
    }

    if (years > 0) {
      return `${years} tahun${months > 0 ? ` ${months} bulan` : ''} data`;
    }
    
    if (months > 0) {
      return `${months} bulan data`;
    }

    // Jika kurang dari 1 bulan, tampilkan hari
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return `${diffDays} hari data`;
  };

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

  const growthData = predictionToday && predictionYesterday 
    ? getChange(predictionToday, predictionYesterday) 
    : { percent: "0", isPositive: 0 };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      
      {
        ds != null &&
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Dashboard <span className="bg-gradient-ml bg-clip-text text-transparent">Toko</span>
            </h1>
              <p className="text-muted-foreground text-lg">
                Prediksi penjualan dan analisis data untuk {namaToko == "" ? "toko anda" : namaToko}
              </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {
              isLoadingPredictionToday || isLoadingPredictionYesterday ? (
                <MetricCard
                  title="Prediksi Hari Ini"
                  value={<Hourglass className="h-8 w-8 text-ml-accent mx-auto mb-2 animate-spin" />}
                  changeType="neutral"
                  icon={<TrendingUp className="h-4 w-4 text-ml-primary" />}
                  gradient
                  />
              ) : (
                <MetricCard
                  title="Prediksi Hari Ini"
                  // value={predictionToday}
                  value="Rp40000"
                  // change={`${growthData["isPositive"] == 0 ? "" : growthData["isPositive"] == 1 ? "+" : "-"}${growthData["percent"]}% dari kemarin`}
                  change={`${growthData["percent"]}% dari kemarin`}
                  changeType={growthData["isPositive"] == 0 ? "neutral" : growthData["isPositive"] == 1 ? "positive" : "negative"}
                  icon={<TrendingUp className="h-4 w-4 text-ml-primary" />}
                  gradient
                />
              )
            }
            <button className="text-left" onClick={() => navigate("/user/dataset#products")}>
              <MetricCard
                title="Total Produk"
                value={ds.total_produk.toLocaleString('id-ID')}
                description="Kategori tersedia"
                icon={<Package className="h-4 w-4 text-ml-accent" />}
                />
            </button>
            <button className="text-left" onClick={() => navigate("/user/dataset#dataset")}>
              <MetricCard
                title="Data Points"
                value={ds.total_transaksi.toLocaleString('id-ID')}
                description="Total transaksi"
                icon={<Database className="h-4 w-4 text-ml-accent" />}
                />
            </button>
            <MetricCard
              title="Periode Data"
              value={`${format_date(ds.periode_awal)} - ${format_date(ds.periode_akhir)}`}
              description={getDurationText(ds.periode_awal, ds.periode_akhir)}
              icon={<Clock className="h-4 w-4 text-ml-accent" />}
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
                    onClick={() => navigate('/user/dataset')}
                    >
                    <div className="flex items-center space-x-2">
                      <Database className="h-4 w-4" />
                      <span>Dataset Toko</span>
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
                      <span>Statistik Penjualan</span>
                    </div>
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  <Button 
                  variant="outline" 
                  className="justify-between h-12"
                  onClick={() => navigate('/user/predictions')}
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
                <Info className="h-5 w-5 text-ml-primary" />
                Informasi Dataset
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={role == "DEVELOPER" ? "grid grid-cols-1 md:grid-cols-3 gap-6" : "grid grid-cols-1 md:grid-cols-2 gap-6"}>
                <div className="text-center p-4 bg-muted/20 rounded-lg">
                  <Clock className="h-8 w-8 text-ml-accent mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Periode Data</h4>
                  <p className="text-sm text-muted-foreground">{format_date(ds.periode_awal)} - {format_date(ds.periode_akhir)}</p>
                </div>
                <div className="text-center p-4 bg-muted/20 rounded-lg">
                  <Database className="h-8 w-8 text-ml-accent mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Total Transaksi</h4>
                  <p className="text-sm text-muted-foreground">{ds.total_transaksi.toLocaleString('id-ID')} Data Points</p>
                </div>
                {
                  role == "DEVELOPER" &&
                  <div className="text-center p-4 bg-muted/20 rounded-lg">
                    <Brain className="h-8 w-8 text-success mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Model Terbaik</h4>
                    <p className="text-sm text-muted-foreground">LSTM</p>
                  </div>
                }
              </div>
            </CardContent>
          </Card>
        </div>
      }
    </div>
  );
};