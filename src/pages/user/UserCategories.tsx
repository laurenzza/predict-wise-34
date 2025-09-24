import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, ArrowLeft, TrendingUp, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const UserCategories = () => {
  const navigate = useNavigate();

  const categories = [
    {
      name: "Kapasitor",
      products: 42,
      totalSales: "Rp 1,250,000,000",
      avgPrice: "Rp 3,500",
      trend: "+5.2%",
      popular: ["Kapasitor 1.5UF 450V", "Kapasitor 2UF Kotak", "Kapasitor Pompa Air 16UF"]
    },
    {
      name: "AS Dinamo Kipas",
      products: 38,
      totalSales: "Rp 980,000,000",
      avgPrice: "Rp 6,200",
      trend: "+3.8%",
      popular: ["AS Dinamo Model Cosmos", "AS Dinamo Miyako", "AS Dinamo Umum RRT"]
    },
    {
      name: "Bushing/Bearing",
      products: 24,
      totalSales: "Rp 560,000,000",
      avgPrice: "Rp 2,100",
      trend: "+2.1%",
      popular: ["Bushing Bearing Kipas", "Bushing Lobang 2", "Bearing Model Cosmos"]
    },
    {
      name: "AS Exsos",
      products: 18,
      totalSales: "Rp 420,000,000",
      avgPrice: "Rp 5,800",
      trend: "+1.5%",
      popular: ["AS Exsos Lobang 2", "AS Exsos Maspion", "AS Exsos Nasional"]
    },
    {
      name: "Spare Parts Lainnya",
      products: 34,
      totalSales: "Rp 290,000,000",
      avgPrice: "Rp 2,800",
      trend: "+0.8%",
      popular: ["Switch Kipas", "Kabel Power", "Mounting Bracket"]
    }
  ];

  const topProducts = [
    { name: "Kapasitor 1.5UF 450V MIKRO", category: "Kapasitor", sales: 2450, revenue: "Rp 8,575,000" },
    { name: "AS Dinamo Model Cosmos/Miyako", category: "AS Dinamo", sales: 1890, revenue: "Rp 13,230,000" },
    { name: "Bushing Bearing Kipas Angin RRT", category: "Bushing", sales: 1650, revenue: "Rp 3,465,000" },
    { name: "Kapasitor 2UF Kotak 450V", category: "Kapasitor", sales: 1420, revenue: "Rp 6,106,000" },
    { name: "AS Exsos Kipas Lobang 2", category: "AS Exsos", sales: 1280, revenue: "Rp 7,680,000" }
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
            Kategori <span className="bg-gradient-ml bg-clip-text text-transparent">Produk</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Analisis kategori produk dan performa penjualan berdasarkan jenis produk
          </p>
        </div>

        {/* Category Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {categories.map((category, index) => (
            <Card key={index} className="shadow-neural border-ml-primary/20 hover:shadow-ml transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-ml-primary" />
                  {category.name}
                </CardTitle>
                <CardDescription>
                  {category.products} produk tersedia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Penjualan:</span>
                    <span className="font-semibold">{category.totalSales}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Harga Rata-rata:</span>
                    <span className="font-semibold">{category.avgPrice}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Tren Bulanan:</span>
                    <Badge className="bg-success/10 text-success border-success/20">
                      {category.trend}
                    </Badge>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <p className="text-sm font-medium mb-2">Produk Populer:</p>
                    <div className="space-y-1">
                      {category.popular.map((product, idx) => (
                        <div key={idx} className="text-xs text-muted-foreground">
                          • {product}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Top Products */}
        <Card className="shadow-neural border-ml-primary/20 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-ml-primary" />
              Top 5 Produk Terlaris
            </CardTitle>
            <CardDescription>
              Produk dengan penjualan tertinggi dalam 6 bulan terakhir
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-ml-primary text-white rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{product.revenue}</div>
                    <div className="text-sm text-muted-foreground">{product.sales} unit terjual</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Analysis */}
        <Card className="shadow-neural border-ml-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-ml-primary" />
              Analisis Kategori
            </CardTitle>
            <CardDescription>
              Insight dan tren penjualan berdasarkan kategori produk
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-success">Kategori Terbaik</h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-4 w-4 text-success mt-0.5" />
                    <p className="text-sm">Kapasitor menunjukkan pertumbuhan penjualan tertinggi (+5.2%)</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-4 w-4 text-success mt-0.5" />
                    <p className="text-sm">AS Dinamo memiliki nilai transaksi rata-rata tertinggi</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-4 w-4 text-success mt-0.5" />
                    <p className="text-sm">Bushing/Bearing memiliki tingkat repeat order yang tinggi</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-ml-primary">Prediksi Kategori</h4>
                <div className="space-y-3">
                  <div className="text-sm">
                    <strong>Kapasitor:</strong> Diprediksi akan tetap menjadi kategori utama
                  </div>
                  <div className="text-sm">
                    <strong>AS Dinamo:</strong> Pertumbuhan stabil dengan demand konsisten
                  </div>
                  <div className="text-sm">
                    <strong>Spare Parts:</strong> Peluang diversifikasi produk tinggi
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};