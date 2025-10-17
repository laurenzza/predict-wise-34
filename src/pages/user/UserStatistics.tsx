import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, ArrowLeft, TrendingUp, DollarSign, Calendar, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const UserStatistics = () => {
  const navigate = useNavigate();

  const salesStats = [
    { period: "Harian", avg: "Rp 107,476", total: "Rp 3,501,987,985", transactions: "32,570" },
    { period: "Mingguan", avg: "Rp 752,332", total: "Rp 24,513,916", transactions: "228" },
    { period: "Bulanan", avg: "Rp 3,009,328", total: "Rp 177,549,434", transactions: "59" },
  ];

  const monthlyTrends = [
    { month: "Jan 2024", sales: "Rp 285,450,000", change: "+5.2%" },
    { month: "Feb 2024", sales: "Rp 292,180,000", change: "+2.4%" },
    { month: "Mar 2024", sales: "Rp 301,920,000", change: "+3.3%" },
    { month: "Apr 2024", sales: "Rp 289,750,000", change: "-4.0%" },
    { month: "Mei 2024", sales: "Rp 315,680,000", change: "+8.9%" },
    { month: "Jun 2024", sales: "Rp 298,340,000", change: "-5.5%" },
  ];

  const statusDistribution = [
    { status: "Pesanan Selesai", count: "31,880", percentage: "97.88%" },
    { status: "Dibatalkan Pembeli", count: "305", percentage: "0.94%" },
    { status: "Dibatalkan Penjual", count: "220", percentage: "0.68%" },
    { status: "Dibatalkan Sistem", count: "165", percentage: "0.51%" },
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
            Statistik <span className="bg-gradient-ml bg-clip-text text-transparent">Penjualan</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Analisis statistik mendalam dari data penjualan
          </p>
        </div>

        {/* Sales Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {salesStats.map((stat, index) => (
            <Card key={index} className="shadow-neural border-ml-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-ml-primary" />
                  Rata-rata {stat.period}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-2xl font-bold text-ml-primary">{stat.avg}</div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Penjualan:</span>
                      <span className="font-medium">{stat.total}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Transaksi:</span>
                      <span className="font-medium">{stat.transactions}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Monthly Trends */}
        <Card className="shadow-neural border-ml-primary/20 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-ml-primary" />
              Tren Penjualan Bulanan
            </CardTitle>
            <CardDescription>
              Performa penjualan 6 bulan terakhir
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {monthlyTrends.map((trend, index) => (
                <div key={index} className="p-4 bg-muted/20 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{trend.month}</h4>
                    <span className={`text-sm font-semibold ${
                      trend.change.startsWith('+') ? 'text-success' : 'text-destructive'
                    }`}>
                      {trend.change}
                    </span>
                  </div>
                  <div className="text-lg font-bold">{trend.sales}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className="shadow-neural border-ml-primary/20 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-ml-primary" />
              Distribusi Status Transaksi
            </CardTitle>
            <CardDescription>
              Breakdown status penyelesaian order dari total 32,570 transaksi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statusDistribution.map((status, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                  <div>
                    <h4 className="font-medium">{status.status}</h4>
                    <p className="text-sm text-muted-foreground">{status.count} transaksi</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{status.percentage}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-neural border-ml-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-ml-primary" />
                Analisis Nilai Transaksi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Rata-rata per Transaksi:</span>
                  <span className="font-semibold">Rp 107,476</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Transaksi Tertinggi:</span>
                  <span className="font-semibold">Rp 4,800,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Transaksi Terendah:</span>
                  <span className="font-semibold">Rp 2,475</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Median:</span>
                  <span className="font-semibold">Rp 52,700</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Standar Deviasi:</span>
                  <span className="font-semibold">Rp 213,356</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-neural border-ml-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-ml-primary" />
                Pola Temporal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Hari Terbaik</h4>
                  <p className="text-sm text-muted-foreground">Senin: 15.2% dari total transaksi</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Bulan Terbaik</h4>
                  <p className="text-sm text-muted-foreground">Mei: 12.8% dari total penjualan tahunan</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Jam Tersibuk</h4>
                  <p className="text-sm text-muted-foreground">10:00 - 12:00: 28% transaksi harian</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};