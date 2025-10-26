import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Package, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useTopProducts, useTopProductsSummary } from "@/hooks/useTopProducts";

export const UserTopProducts = () => {
  const navigate = useNavigate();

  const { data: top_products, isLoading, isError } = useTopProducts();
  const { data: top_products_summary, isLoading: isLoadingSummary, isError: isErrorSummary } = useTopProductsSummary();

  const topProducts = [
    { 
      rank: 1,
      product: "Kapasitor 1.5UF", 
      category: "Elektronik",
      totalSales: "Rp 8,450,000",
      quantity: 1250,
      transactions: 245,
      growth: "+12.5%"
    },
    { 
      rank: 2,
      product: "AS Dinamo Kipas Angin", 
      category: "Sparepart",
      totalSales: "Rp 7,220,000",
      quantity: 980,
      transactions: 198,
      growth: "+8.3%"
    },
    { 
      rank: 3,
      product: "Bushing Bearing", 
      category: "Sparepart",
      totalSales: "Rp 6,890,000",
      quantity: 1450,
      transactions: 223,
      growth: "+15.2%"
    },
    { 
      rank: 4,
      product: "Kapasitor 2UF", 
      category: "Elektronik",
      totalSales: "Rp 6,150,000",
      quantity: 890,
      transactions: 178,
      growth: "+6.7%"
    },
    { 
      rank: 5,
      product: "AS Exsos Kipas", 
      category: "Sparepart",
      totalSales: "Rp 5,780,000",
      quantity: 820,
      transactions: 165,
      growth: "+9.1%"
    },
    { 
      rank: 6,
      product: "Kapasitor Pompa Air", 
      category: "Elektronik",
      totalSales: "Rp 5,230,000",
      quantity: 710,
      transactions: 142,
      growth: "+5.4%"
    },
    { 
      rank: 7,
      product: "Motor Dinamo 12V", 
      category: "Elektronik",
      totalSales: "Rp 4,890,000",
      quantity: 650,
      transactions: 134,
      growth: "+7.8%"
    },
    { 
      rank: 8,
      product: "Bearing 6200", 
      category: "Sparepart",
      totalSales: "Rp 4,560,000",
      quantity: 890,
      transactions: 156,
      growth: "+4.2%"
    },
    { 
      rank: 9,
      product: "Seal Karet 10mm", 
      category: "Sparepart",
      totalSales: "Rp 4,120,000",
      quantity: 1120,
      transactions: 189,
      growth: "+11.3%"
    },
    { 
      rank: 10,
      product: "Switch On/Off", 
      category: "Elektronik",
      totalSales: "Rp 3,890,000",
      quantity: 780,
      transactions: 145,
      growth: "+3.9%"
    },
  ];

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
            Kembali
          </Button>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Produk <span className="bg-gradient-ml bg-clip-text text-transparent">Terlaris</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Top 10 produk dengan penjualan tertinggi
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-neural border-ml-primary/20">
            <CardContent className="flex items-center p-6">
              <div className="p-3 rounded-full bg-ml-primary/10 mr-4">
                <DollarSign className="h-6 w-6 text-ml-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Penjualan Top 10</p>
                {
                  isLoadingSummary ? (
                    <p className="text-2xl font-bold">Loading...</p>
                  ) : (
                    <p className="text-2xl font-bold">{top_products_summary.total_penjualan_top.toLocaleString('id-ID', {style: "currency", currency: "IDR"})}</p>
                  )
                }
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-neural border-ml-primary/20">
            <CardContent className="flex items-center p-6">
              <div className="p-3 rounded-full bg-ml-accent/10 mr-4">
                <Package className="h-6 w-6 text-ml-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Unit Terjual</p>
                {
                  isLoadingSummary ? (
                    <p className="text-2xl font-bold">Loading...</p>
                  ) : (
                    <p className="text-2xl font-bold">{top_products_summary.total_unit_terjual_top.toLocaleString('id-ID')}</p>
                  )
                }
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-neural border-ml-primary/20">
            <CardContent className="flex items-center p-6">
              <div className="p-3 rounded-full bg-success/10 mr-4">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rata-rata Pertumbuhan</p>
                <p className="text-2xl font-bold">+8.4%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Products List */}
        <Card className="shadow-neural border-ml-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-ml-primary" />
              Daftar Produk Terlaris
            </CardTitle>
            <CardDescription>
              10 produk dengan performa penjualan terbaik
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {
                isLoading ? (
                  <p className="text-2xl font-bold">Loading...</p>
                ) : (
                  top_products.map((product, index) => (
                    <div 
                      key={index}
                      className="p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-ml text-white font-bold">
                            {index+1}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{product.nama_produk}</h3>
                            {/* <Badge variant="outline" className="mb-2">
                              {product.category}
                            </Badge> */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground mt-2">
                              <div>
                                <span className="font-medium">Unit Terjual:</span> {product.total_unit_terjual.toLocaleString('id-ID')}
                              </div>
                              <div>
                                <span className="font-medium">Transaksi:</span> {product.total_transaksi}
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="font-medium">Pertumbuhan:</span>
                                <span className="text-success font-semibold">10%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-ml-primary">{product.total_penjualan.toLocaleString('id-ID', {style: "currency", currency: "IDR"})}</p>
                          <p className="text-xs text-muted-foreground mt-1">Total Penjualan</p>
                        </div>
                      </div>
                    </div>
                  ))
                )
              }
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
