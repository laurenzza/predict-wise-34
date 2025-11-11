import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowLeft, TrendingUp, BarChart3, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { TotalPredictions, useDailyPredictions, useMonthlyPredictions, useTotalPredictions, useWeeklyPredictions } from "@/hooks/usePredictions";
import { useDataSummary } from "@/store/DataSummaryStore";

export const UserPeriod = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | null>(null);

  const { data: data_total, isLoading: is_loading_total, isError: is_error_total } = useTotalPredictions();
  const { data: data_daily, isLoading: is_loading_daily, isError: is_error_daily } = useDailyPredictions();
  const { data: data_weekly, isLoading: is_loading_weekly, isError: is_error_weekly } = useWeeklyPredictions();
  const { data: data_monthly, isLoading: is_loading_monthly, isError: is_error_monthly } = useMonthlyPredictions();
  const [dataDaily, setDataDaily] = useState<Map<number, string[]> | null>(null);
  const [dataWeekly, setDataWeekly] = useState<Map<number, string[]> | null>(null);
  const [dataMonthly, setDataMonthly] = useState<Map<number, string[]> | null>(null);
  const [selectedDataTotal, setSelectedDataTotal] = useState<number[] | null>(null);
  const [selectedTotal, setSelectedTotal] = useState<number>(0);

  const ds = useDataSummary();

  useEffect(() => {
    if(selectedPeriod == null || data_total.job_status != "success") return;

    if(selectedPeriod == 'daily'){
      const newData = [];
      let subTotal = 0;
      for(let i = 0; i < 7; i++){
        newData.push(data_total.data[i].hasil_total_penjualan_lstm);
        subTotal += data_total.data[i].hasil_total_penjualan_lstm;
      }
      setSelectedTotal(subTotal);
      setSelectedDataTotal(newData);
    }
    else if(selectedPeriod == 'weekly'){
      const newData = [];
      let temp = 0;
      let subTotal = 0;
      for(let i = 0; i < 28; i++){
        temp += data_total.data[i].hasil_total_penjualan_lstm;
        subTotal += data_total.data[i].hasil_total_penjualan_lstm;
        if((i+1)%7 == 0){
          newData.push(temp);
          temp = 0;
        }
      }
      setSelectedTotal(subTotal);
      setSelectedDataTotal(newData);
    }
    else if(selectedPeriod == 'monthly'){
      const newData = [];
      let temp = 0;
      let subTotal = 0;
      for(let i = 0; i < 90; i++){
        temp += data_total.data[i].hasil_total_penjualan_lstm;
        subTotal += data_total.data[i].hasil_total_penjualan_lstm;
        if((i+1)%30 == 0){
          newData.push(temp);
          temp = 0;
        }
      }
      setSelectedTotal(subTotal);
      setSelectedDataTotal(newData);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    if(data_daily == undefined || data_daily.job_status != "success") return;

    const temp = new Map<number, string[]>();
    data_daily.data.forEach((row) => {
      const current = temp.get(row.hari) || [];
      current.push(row.hasil_nama_produk_lstm)
      temp.set(row.hari, current)
    });

    setDataDaily(temp);

  }, [data_daily]);

  useEffect(() => {
    if(data_weekly == undefined || data_weekly.job_status != "success") return;

    const temp = new Map<number, string[]>();
    data_weekly.data.forEach((row) => {
      const current = temp.get(row.minggu) || [];
      current.push(row.hasil_nama_produk_lstm)
      temp.set(row.minggu, current)
    });

    setDataWeekly(temp);

  }, [data_weekly]);

  useEffect(() => {
    if(data_monthly == undefined || data_monthly.job_status != "success") return;

    const temp = new Map<number, string[]>();
    data_monthly.data.forEach((row) => {
      const current = temp.get(row.bulan) || [];
      current.push(row.hasil_nama_produk_lstm)
      temp.set(row.bulan, current)
    });

    setDataMonthly(temp);

  }, [data_monthly]);

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
          
          {
            !(data_total?.job_status === 'failed' && data_total?.job_status === undefined) &&
            <>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Periode <span className="bg-gradient-ml bg-clip-text text-transparent">Analisis</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Pilih periode waktu untuk analisis prediksi penjualan
              </p>
            </>
          }
        </div>

        {
          data_total?.job_status === 'running' || is_loading_total ?
          (
            <p>
              Data anda sedang diproses, mohon tunggu
            </p>
          ) :
          <>
            { 
              (data_total?.job_status === 'failed' || data_total?.job_status === undefined) ?
              (
                <p>Please run prediction</p>
              ) : (
              <>
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
                  {selectedPeriod === 'daily' && selectedDataTotal != null && data_daily != undefined && (
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
                          {selectedDataTotal.map((pred, index) => (
                            <div key={index} className="p-4 bg-muted/20 rounded-lg">
                              <div className="flex justify-between items-start mb-3">
                                <h4 className="font-medium">Hari {index+1}</h4>
                                <Badge className="bg-ml-primary/10 text-ml-primary border-ml-primary/20">
                                  {pred.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                                </Badge>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Produk Teratas:</p>
                                {dataDaily?.get(index+1)?.map((product, idx) => (
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
                                {selectedTotal.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {selectedPeriod === 'weekly' && selectedDataTotal != null && data_weekly != undefined && (
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
                            {selectedDataTotal.map((pred, index) => (
                              <div key={index} className="p-4 bg-muted/20 rounded-lg">
                                <div className="flex justify-between items-start mb-3">
                                  <h4 className="font-medium">Minggu {index+1}</h4>
                                  <Badge className="bg-lstm/10 text-lstm border-lstm/20">
                                    {pred.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                                  </Badge>
                                </div>
                                <div className="space-y-2">
                                  <p className="text-sm text-muted-foreground">Kategori Produk Utama:</p>
                                  {dataWeekly?.get(index+1)?.map((product, idx) => (
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
                                  {selectedTotal.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}

                  {selectedPeriod === 'monthly' && selectedDataTotal != null && data_monthly != undefined && (
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
                          {selectedDataTotal.map((pred, index) => (
                            <div key={index} className="p-4 bg-muted/20 rounded-lg">
                              <div className="flex justify-between items-start mb-3">
                                <h4 className="font-medium">Bulan {index+1}</h4>
                                <Badge className="bg-arima/10 text-arima border-arima/20">
                                  {pred.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                                </Badge>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Kategori Produk Utama:</p>
                                {dataMonthly?.get(index+1)?.map((product, idx) => (
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
                                {selectedTotal.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
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
                          <p className="text-sm text-muted-foreground">{(new Date(ds.periode_awal)).toLocaleString('id-ID', { month: "long", year: "numeric" })}</p>
                        </div>
                        <div className="text-center p-4 bg-muted/20 rounded-lg">
                          <Calendar className="h-8 w-8 text-ml-accent mx-auto mb-2" />
                          <h4 className="font-semibold mb-1">Berakhir</h4>
                          <p className="text-sm text-muted-foreground">{(new Date(ds.periode_akhir)).toLocaleString('id-ID', { month: "long", year: "numeric" })}</p>
                        </div>
                        <div className="text-center p-4 bg-muted/20 rounded-lg">
                          <TrendingUp className="h-8 w-8 text-ml-accent mx-auto mb-2" />
                          <h4 className="font-semibold mb-1">Total Hari</h4>
                          <p className="text-sm text-muted-foreground">{Math.round((new Date(ds.periode_akhir).getTime() - new Date(ds.periode_awal).getTime()) / (1000 * 60 * 60 * 24)).toLocaleString('id-ID')} hari</p>
                        </div>
                        <div className="text-center p-4 bg-muted/20 rounded-lg">
                          <BarChart3 className="h-8 w-8 text-ml-accent mx-auto mb-2" />
                          <h4 className="font-semibold mb-1">Total Transaksi</h4>
                          <p className="text-sm text-muted-foreground">{ds.total_transaksi.toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )
            }
          </>
        }
      </div>
    </div>
  );
};