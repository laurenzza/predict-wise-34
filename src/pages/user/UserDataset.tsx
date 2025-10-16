import { Navbar } from "@/components/layout/Navbar";
import { DatasetTable } from "@/components/datasets/DatasetTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, ArrowLeft, FileText, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const UserDataset = () => {
  const navigate = useNavigate();

  const datasetStats = [
    { label: "Total Transaksi", value: "32,570", icon: Database, color: "text-ml-primary" },
    { label: "Periode Data", value: "Mei 2020 - Sep 2024", icon: FileText, color: "text-ml-accent" },
    { label: "Produk Unik", value: "156", icon: TrendingUp, color: "text-success" },
    { label: "Status Selesai", value: "97.8%", icon: TrendingUp, color: "text-success" },
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
            Dataset <span className="bg-gradient-ml bg-clip-text text-transparent">Toko</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Data transaksi penjualan Toko Loa Kim Jong
          </p>
        </div>

        {/* Dataset Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {datasetStats.map((stat, index) => (
            <Card key={index} className="shadow-neural border-ml-primary/20">
              <CardContent className="flex items-center p-6">
                <div className={`p-3 rounded-full bg-muted/20 mr-4`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dataset Table */}
        <Card className="shadow-neural border-ml-primary/20 mb-8">
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