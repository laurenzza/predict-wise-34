import { Navbar } from "@/components/layout/Navbar";
import { DatasetTable } from "@/components/datasets/DatasetTable";
import { MetricCard } from "@/components/cards/MetricCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Database, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  BarChart3,
  Download,
  Eye,
  Calendar
} from "lucide-react";

export const Dataset = () => {
  const datasetStats = [
    { label: "Total Transaksi", value: "32,570", color: "text-ml-primary" },
    { label: "Pesanan Selesai", value: "31,880", color: "text-success" },
    { label: "Dibatalkan", value: "690", color: "text-error" },
    { label: "Periode Data", value: "2020-2024", color: "text-ml-accent" }
  ];

  const dataQuality = [
    { metric: "Completeness", value: "100%", status: "excellent" },
    { metric: "Consistency", value: "99.8%", status: "excellent" },
    { metric: "Accuracy", value: "99.5%", status: "excellent" },
    { metric: "Uniqueness", value: "100%", status: "excellent" }
  ];

  const productCategories = [
    { category: "AS Dinamo Kipas Angin", count: 12500, percentage: 38.4 },
    { category: "Kapasitor", count: 8200, percentage: 25.2 },
    { category: "Bearing/Boshing", count: 6800, percentage: 20.9 },
    { category: "Spare Parts Lainnya", count: 5070, percentage: 15.5 }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Dataset <span className="bg-gradient-ml bg-clip-text text-transparent">Penjualan</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Eksplorasi data penjualan Toko Loa Kim Jong untuk training model machine learning
          </p>
        </div>

        {/* Dataset Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Records"
            value="32,570"
            change="4 tahun data"
            changeType="neutral"
            icon={<Database className="h-4 w-4 text-ml-primary" />}
            gradient
          />
          <MetricCard
            title="Data Quality"
            value="99.8%"
            change="Sangat baik"
            changeType="positive"
            icon={<CheckCircle2 className="h-4 w-4 text-success" />}
          />
          <MetricCard
            title="Missing Values"
            value="0%"
            change="Data lengkap"
            changeType="positive"
            icon={<FileText className="h-4 w-4 text-success" />}
          />
          <MetricCard
            title="Periode"
            value="2020-2024"
            description="Mei 2020 - Sept 2024"
            icon={<Calendar className="h-4 w-4 text-ml-accent" />}
          />
        </div>

        {/* Data Table */}
        <div className="mb-8">
          <DatasetTable />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Data Quality Metrics */}
          <Card className="shadow-neural border-ml-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                Kualitas Data
              </CardTitle>
              <CardDescription>
                Metrik kualitas dataset untuk machine learning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataQuality.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                    <div>
                      <p className="font-medium">{item.metric}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.metric === "Completeness" && "Kelengkapan data"}
                        {item.metric === "Consistency" && "Konsistensi format"}
                        {item.metric === "Accuracy" && "Akurasi nilai"}
                        {item.metric === "Uniqueness" && "Keunikan record"}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">{item.value}</div>
                      <Badge className="bg-success/10 text-success border-success/20">
                        Excellent
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Product Categories */}
          <Card className="shadow-neural border-ml-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-ml-primary" />
                Kategori Produk
              </CardTitle>
              <CardDescription>
                Distribusi transaksi berdasarkan kategori produk
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productCategories.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.category}</span>
                      <span className="text-sm text-muted-foreground">{item.count} transaksi</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-ml h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Dataset Statistics */}
          <Card className="shadow-neural border-ml-primary/20 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-ml-primary" />
                Statistik Dataset
              </CardTitle>
              <CardDescription>
                Ringkasan statistik untuk analisis exploratory data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {datasetStats.map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-muted/20 rounded-lg">
                    <div className={`text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-ml-primary/5 border border-ml-primary/20 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-ml-primary" />
                  Informasi Dataset
                </h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Data mencakup transaksi penjualan dari Mei 2020 hingga September 2024</p>
                  <p>• Kolom utama: Invoice, Tanggal Pembayaran, Status, Nama Produk, Jumlah, Harga, Total</p>
                  <p>• Data telah dibersihkan dan siap untuk training model machine learning</p>
                  <p>• Tingkat akurasi prediksi: LSTM (96.8%), ARIMA (94.2%)</p>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button variant="ml" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button variant="outline" className="flex-1 border-ml-primary/30 hover:bg-ml-primary/10">
                  <Eye className="h-4 w-4 mr-2" />
                  Detail Analisis
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};