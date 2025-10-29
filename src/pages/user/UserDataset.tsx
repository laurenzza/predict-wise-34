import { Navbar } from "@/components/layout/Navbar";
import { DatasetTable } from "@/components/datasets/DatasetTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, ArrowLeft, FileText, TrendingUp, Package } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDataSummary, useFormatDate } from "@/store/DataSummaryStore";
import { useSalesDataset } from "@/hooks/useSalesDataset";
import { ProductTable } from "@/components/datasets/ProductTable";
import { useAuthNamaToko } from "@/store/AuthStore";
import { useEffect } from "react";

export const UserDataset = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const ds = useDataSummary();
  const format_date = useFormatDate();

  const nama_toko = useAuthNamaToko();

  const datasetStats = [
    { 
      label: "Total Transaksi", 
      value: ds.total_transaksi.toLocaleString('id-ID'), 
      icon: Database, 
      color: "text-ml-primary",
      description: "Jumlah keseluruhan transaksi yang tercatat"
    },
    { 
      label: "Periode Data", 
      value: `${format_date(ds.periode_awal)} - ${format_date(ds.periode_akhir)}`, 
      icon: FileText, 
      color: "text-ml-accent",
      description: "Rentang waktu data transaksi"
    },
    { 
      label: "Produk Unik", 
      value: ds.total_produk.toLocaleString('id-ID'), 
      icon: Package, 
      color: "text-ml-accent",
      description: "Jumlah variasi produk yang berbeda"
    },
    { 
      label: "Status Selesai", 
      value: (ds.total_status_selesai / ds.total_transaksi * 100).toFixed(2).toString() + "%", 
      icon: TrendingUp, 
      color: "text-success",
      description: "Persentase transaksi yang berhasil diselesaikan"
    },
    { 
      label: "Status Batal", 
      value: (ds.total_status_dibatalkan / ds.total_transaksi * 100).toFixed(2).toString() + "%", 
      icon: FileText, 
      color: "text-destructive",
      description: "Persentase transaksi yang dibatalkan"
    },
  ];

  useEffect(() => {
    if(location.hash){
      const target_id = location.hash.replace("#", "");
      const element = document.getElementById(target_id);
      if(element){
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

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
            Dataset <span className="bg-gradient-ml bg-clip-text text-transparent">Toko</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Data transaksi penjualan {nama_toko == "" ? "toko anda" : nama_toko}
          </p>
        </div>

        {/* Dataset Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {datasetStats.map((stat, index) => (
            <Card key={index} className="shadow-neural border-ml-primary/20">
              <CardContent className="flex flex-col p-6">
                <div className="flex items-center mb-2">
                  <div className={`p-3 rounded-full bg-muted/20 mr-4`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Product Table */}
        <Card id="products" className="shadow-neural border-ml-primary/20 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-ml-accent" />
              Data Produk
            </CardTitle>
            <CardDescription>
              Data produk yang dimiliki
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductTable />
          </CardContent>
        </Card>

        {/* Dataset Table */}
        <Card id="dataset" className="shadow-neural border-ml-primary/20 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-ml-primary" />
              Data Transaksi
            </CardTitle>
            <CardDescription>
              Data transaksi yang dimiliki
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DatasetTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};