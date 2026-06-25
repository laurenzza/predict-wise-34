import { useState, useEffect, ChangeEvent } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { DatasetTable } from "@/components/datasets/DatasetTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Database, ArrowLeft, FileText, TrendingUp, Package, Upload, PlusCircle, RefreshCw, PenSquare, Plus, X, ShoppingCart, Trash2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDataSummary, useFormatDate, useSummarizeData } from "@/store/DataSummaryStore";
import { ProductTable } from "@/components/datasets/ProductTable";
import { useAuthNamaToko, useAuthRole, useAuthId, useAuthToken, useAuthUploadFile } from "@/store/AuthStore";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { apiRunPrediction, apiDeleteSales, apiUploadSalesManual } from "@/api";
// import { apiUploadBulkManualSales } from "@/api"; 
import { PredictionComparisonBase, useCompare, usePredictionMetrics, useSevenDaysPrediction } from "@/hooks/usePredictions";
import * as XLSX from "xlsx";

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';
type UploadMode = 'replace' | 'append';

// --- NEW: Types for 1-to-Many Form ---
type TransactionHeader = {
  invoice: string;
  tanggal_pembayaran: string;
  status_terakhir: string;
};

type ProductItem = {
  id: string; // Unique identifier for mapping
  nama_produk: string;
  jumlah_produk_dibeli: number;
  harga_jual: number;
};

export const UserDataManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const summarize_data = useSummarizeData();

  const role = useAuthRole();
  const user_id = useAuthId();
  const access_token = useAuthToken();
  const nama_toko = useAuthNamaToko();
  const upload_file = useAuthUploadFile();

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [isTraining, setIsTraining] = useState(false);
  const [uploadMode, setUploadMode] = useState<UploadMode>('replace');

  // --- NEW: State for Header (1) and Products (Many) ---
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);
  
  const [transactionHeader, setTransactionHeader] = useState<TransactionHeader>({
    invoice: "",
    tanggal_pembayaran: new Date().toISOString().split('T')[0],
    status_terakhir: "Pesanan Selesai",
  });

  const generateEmptyProduct = (): ProductItem => ({
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString() + Math.random().toString(),
    nama_produk: "",
    jumlah_produk_dibeli: 1,
    harga_jual: 0,
  });

  const [products, setProducts] = useState<ProductItem[]>([
    generateEmptyProduct()
  ]);

  // Calculate Grand Total for all products in the invoice
  const grandTotalPenjualan = products.reduce((sum, item) => {
    return sum + (item.jumlah_produk_dibeli * item.harga_jual);
  }, 0);

  const { data: data_total } = useSevenDaysPrediction(new Date().toISOString().split('T')[0]);
  const { data: data_comparisons } = useCompare();
  const { data: data_metrics } = usePredictionMetrics();

  useEffect(() => {
    if(location.hash){
      const target_id = location.hash.replace("#", "");
      const element = document.getElementById(target_id);
      if(element){
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      toast({
        title: "File Berhasil Dipilih",
        description: `File: ${e.target.files[0].name}`,
      });
    } else {
      setFile(null);
    }
  }

  const handleFileUpload = async (e: React.FormEvent) => {
    if(!file) return;

    setStatus('uploading');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', uploadMode);

    try {
      await upload_file(formData);
      await summarize_data(user_id, access_token);

      setStatus("success");
      
      const actionText = uploadMode === 'replace' ? "diganti" : "ditambahkan";
      toast({
        title: "Berhasil Upload File",
        description: `Data berhasil ${actionText}. Silakan klik 'Mulai Training' untuk update prediksi.`
      })
    } catch (error) {
      console.error(error);
      setStatus("error");
      toast({
        title: "Upload Gagal",
        description: "Perhatikan format file dan coba lagi",
        variant: "destructive"
      })
    }
  }

  const handleRunTraining = async () => {
    setIsTraining(true);
    try {
      await apiRunPrediction();
      queryClient.invalidateQueries({ queryKey: ["predictions"] });
      await summarize_data(user_id, access_token);
      toast({
        title: "Training Dalam Proses",
        description: "Model prediksi sedang diperbarui.",
        className: "bg-green-600 text-white"
      });
    } catch (error) {
      console.error("Training Error:", error);
      toast({
        title: "Training Gagal",
        description: "Terjadi kesalahan saat memproses model.",
        variant: "destructive"
      });
    } finally {
      setIsTraining(false);
    }
  };

  // --- NEW: Handlers for 1-to-Many Form ---
  const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTransactionHeader(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = () => {
    setProducts(prev => [...prev, generateEmptyProduct()]);
  };

  const handleRemoveProduct = (id: string) => {
    setProducts(prev => prev.filter(item => item.id !== id));
  };

  const handleProductChange = (id: string, field: keyof ProductItem, value: string | number) => {
    setProducts(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          [field]: (field === 'jumlah_produk_dibeli' || field === 'harga_jual') ? Number(value) : value
        };
      }
      return item;
    }));
  };

  const handleManualDataSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (products.length === 0) {
      toast({
        title: "Data Kosong",
        description: "Tambahkan setidaknya satu produk ke dalam transaksi.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmittingManual(true);

    // Flatten the data: attach header info to every single product
    const payload = products.map(prod => ({
      invoice: transactionHeader.invoice,
      tanggal_pembayaran: transactionHeader.tanggal_pembayaran,
      status_terakhir: transactionHeader.status_terakhir,
      nama_produk: prod.nama_produk,
      jumlah_produk_dibeli: prod.jumlah_produk_dibeli,
      harga_jual: prod.harga_jual,
      total_penjualan: (prod.jumlah_produk_dibeli * prod.harga_jual)
    }));

    try {
      // TODO: Replace with actual backend call
      // await apiUploadBulkManualSales(payload);
      console.log("Submitting transaction data:", payload);
      const result = await apiUploadSalesManual(payload)
      
      await summarize_data(user_id, access_token);
      
      toast({
        title: "Berhasil Menyimpan Transaksi",
        description: `Transaksi dengan ${payload.length} produk berhasil ditambahkan.`
      });

      // Reset form entirely
      setTransactionHeader({
        invoice: "",
        tanggal_pembayaran: new Date().toISOString().split('T')[0],
        status_terakhir: "Pesanan Selesai",
      });
      setProducts([generateEmptyProduct()]);

    } catch (error) {
      console.error("Manual Data Upload Error:", error);
      toast({
        title: "Gagal Menambahkan Data",
        description: "Pastikan semua field terisi dengan benar.",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingManual(false);
    }
  };

  const handleExportExcel = () => {
    if (!data_total || !data_comparisons || !data_metrics) {
      alert("Data belum siap untuk diekspor! Harap tunggu atau jalankan prediksi.");
      return;
    }

    const totalSheetData = data_total["predictions"].map((item: any, index: number) => ({
      No: index + 1,
      Tanggal: new Date(item["date"]).toLocaleDateString("id-ID"),
      "Total Penjualan ARIMA": item["ARIMA"]["value"],
      "Total Penjualan LSTM": item["LSTM"]["value"],
      "Selisih": Math.abs(item["ARIMA"]["value"] - item["LSTM"]["value"])
    }));
    const totalSheet = XLSX.utils.json_to_sheet(totalSheetData);

    const comparisonSheetData = data_comparisons["data"].map((item: PredictionComparisonBase) => ({
      Hari: item["day"],
      Aktual: item["actual"],
      ARIMA: item["arima_pred"],
      LSTM: item["lstm_pred"],
    }));
    const comparisonSheet = XLSX.utils.json_to_sheet(comparisonSheetData);

    const metricSheetData = [
      {
        Metric: "Mean Absolute Error (MAE)",
        ARIMA: data_metrics.data.arima_mae,
        LSTM: data_metrics.data.lstm_mae,
      },
      {
        Metric: "Root Mean Squared Error (RMSE)",
        ARIMA: data_metrics.data.arima_rmse,
        LSTM: data_metrics.data.lstm_rmse,
      },
      {
        Metric: "Training Time (s)",
        ARIMA: data_metrics.data.arima_waktu_train,
        LSTM: data_metrics.data.lstm_waktu_train,
      },
      {
        Metric: "Memory Usage (MB)",
        ARIMA: data_metrics.data.arima_memori,
        LSTM: data_metrics.data.lstm_memori,
      },
    ];
    const metricSheet = XLSX.utils.json_to_sheet(metricSheetData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, totalSheet, "Total Predictions");
    XLSX.utils.book_append_sheet(workbook, comparisonSheet, "Prediction Comparisons");
    XLSX.utils.book_append_sheet(workbook, metricSheet, "Prediction Metrics");

    if(nama_toko != ""){
      XLSX.writeFile(workbook, `Prediksi Toko ${nama_toko}.xlsx`);
    } else {
      XLSX.writeFile(workbook, "Prediksi Toko.xlsx");
    }
  }

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
            Manajemen <span className="bg-gradient-ml bg-clip-text text-transparent">Data</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            {role == "OWNER" ? "Export" : "Upload dan train"} data penjualan anda
          </p>
        </div>

        {/* Manajemen Data Section */}
        <Card id="data-management" className="shadow-neural border-ml-primary/20 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-ml-primary" />
              Manajemen Data
            </CardTitle>
            <CardDescription>
              Upload, perbarui model prediksi, atau export data Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {
              role == "EMPLOYEE" && (
                <>  
                  {/* --- MODIFIED: 1-to-Many Manual Data Section --- */}
                  <div className="p-0 border border-blue-200 rounded-lg overflow-hidden shadow-sm">
                    {/* Form Header Title */}
                    <div className="bg-blue-50 p-4 border-b border-blue-200">
                      <h4 className="font-medium flex items-center gap-2 text-blue-800">
                        <PenSquare className="h-5 w-5" />
                        Input Transaksi Manual
                      </h4>
                      <p className="text-sm text-blue-600/80">
                        Buat satu transaksi dan tambahkan daftar produk di dalamnya.
                      </p>
                    </div>

                    <form onSubmit={handleManualDataSubmit} className="p-4 space-y-6 bg-white">
                      
                      {/* SECTION 1: GLOBAL TRANSACTION HEADER */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-gray-100">
                        <div className="space-y-2">
                          <Label className="text-gray-600">No. Invoice</Label>
                          <Input 
                            required
                            name="invoice"
                            placeholder="e.g., INV-001"
                            value={transactionHeader.invoice}
                            onChange={handleHeaderChange}
                            className="bg-gray-50/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-600">Tanggal Pembayaran</Label>
                          <Input 
                            required
                            type="date"
                            name="tanggal_pembayaran"
                            value={transactionHeader.tanggal_pembayaran}
                            onChange={handleHeaderChange}
                            className="bg-gray-50/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-600">Status Terakhir</Label>
                          <select 
                            required
                            name="status_terakhir"
                            value={transactionHeader.status_terakhir}
                            onChange={handleHeaderChange}
                            className="flex h-10 w-full rounded-md border border-input bg-gray-50/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="Pesanan Selesai">Pesanan Selesai</option>
                            <option value="Sedang Dikirim">Sedang Dikirim</option>
                            <option value="Dibatalkan Pembeli">Dibatalkan Pembeli</option>
                            <option value="Dibatalkan Penjual">Dibatalkan Penjual</option>
                            <option value="Dibatalkan Sistem">Dibatalkan Sistem</option>
                          </select>
                        </div>
                      </div>

                      {/* SECTION 2: PRODUCTS LIST */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-end mb-2">
                          <Label className="text-base font-semibold text-blue-900 flex items-center gap-2">
                            <ShoppingCart className="w-4 h-4" />
                            Daftar Produk ({products.length})
                          </Label>
                        </div>

                        {products.map((prod, index) => {
                          const itemTotal = prod.jumlah_produk_dibeli * prod.harga_jual;
                          return (
                            <div key={prod.id} className="relative flex flex-col md:flex-row gap-3 p-3 bg-blue-50/30 border border-blue-100 rounded-md items-start md:items-end">
                              
                              <div className="w-full space-y-1">
                                <Label className="text-xs text-gray-500">Nama Produk</Label>
                                <Input 
                                  required
                                  placeholder="e.g., Kapasitor"
                                  value={prod.nama_produk}
                                  onChange={(e) => handleProductChange(prod.id, 'nama_produk', e.target.value)}
                                />
                              </div>
                              
                              <div className="w-full md:w-32 space-y-1">
                                <Label className="text-xs text-gray-500">Jumlah</Label>
                                <Input 
                                  required
                                  type="number"
                                  min="1"
                                  value={prod.jumlah_produk_dibeli}
                                  onChange={(e) => handleProductChange(prod.id, 'jumlah_produk_dibeli', e.target.value)}
                                />
                              </div>
                              
                              <div className="w-full md:w-48 space-y-1">
                                <Label className="text-xs text-gray-500">Harga Satuan (IDR)</Label>
                                <Input 
                                  required
                                  type="number"
                                  min="0"
                                  value={prod.harga_jual}
                                  onChange={(e) => handleProductChange(prod.id, 'harga_jual', e.target.value)}
                                />
                              </div>

                              <div className="w-full md:w-48 space-y-1">
                                <Label className="text-xs text-gray-500">Subtotal</Label>
                                <div className="h-10 flex items-center px-3 bg-blue-100/50 border border-blue-200 rounded-md font-semibold text-blue-900 overflow-hidden text-ellipsis whitespace-nowrap">
                                  Rp {itemTotal.toLocaleString('id-ID')}
                                </div>
                              </div>

                              {products.length > 1 && (
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  className="h-10 px-3 text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0 w-full md:w-auto mt-2 md:mt-0"
                                  onClick={() => handleRemoveProduct(prod.id)}
                                >
                                  <Trash2 className="h-4 w-4 md:mr-0 mr-2" />
                                  <span className="md:hidden">Hapus Produk</span>
                                </Button>
                              )}
                            </div>
                          );
                        })}

                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={handleAddProduct}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50 mt-2"
                        >
                          <Plus className="h-4 w-4 mr-2" /> Tambah Produk Lain
                        </Button>
                      </div>

                      {/* SECTION 3: FOOTER & SUBMIT */}
                      <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-600">Total Transaksi:</span>
                          <span className="text-2xl font-bold text-blue-900">
                            Rp {grandTotalPenjualan.toLocaleString('id-ID')}
                          </span>
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white min-w-[200px]"
                          disabled={isSubmittingManual || products.length === 0}
                        >
                          {isSubmittingManual ? 'Menyimpan...' : `Simpan Transaksi`}
                        </Button>
                      </div>
                    </form>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-muted-foreground">Atau</span></div>
                  </div>

                  {/* Upload File Section */}
                  <div className="p-4 bg-ml-primary/5 border border-ml-primary/20 rounded-lg space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Upload className="h-5 w-5 text-ml-primary" />
                      Upload File Sekaligus (CSV)
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Upload file CSV dengan kolom: Tanggal Pembayaran, Status Terakhir, Nama Produk, Jumlah Produk Dibeli, Harga Jual, Total Penjualan
                    </p>

                    <div className="bg-white p-3 rounded border space-y-2">
                      <Label className="text-xs font-bold uppercase text-gray-500">Pilih Metode Upload:</Label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <label className={`flex items-center gap-2 p-3 rounded cursor-pointer border transition-all ${uploadMode === 'replace' ? 'bg-red-50 border-red-200 ring-1 ring-red-400' : 'hover:bg-gray-50'}`}>
                          <input 
                            type="radio" 
                            name="uploadMode" 
                            checked={uploadMode === 'replace'} 
                            onChange={() => setUploadMode('replace')}
                            className="accent-red-500 w-4 h-4"
                          />
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm flex items-center gap-1"><FileText className="w-3 h-3"/> Rewrite (Tulis Ulang)</span>
                            <span className="text-xs text-muted-foreground">Hapus semua data lama, ganti dengan file ini.</span>
                          </div>
                        </label>

                        <label className={`flex items-center gap-2 p-3 rounded cursor-pointer border transition-all ${uploadMode === 'append' ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-400' : 'hover:bg-gray-50'}`}>
                          <input 
                            type="radio" 
                            name="uploadMode" 
                            checked={uploadMode === 'append'} 
                            onChange={() => setUploadMode('append')}
                            className="accent-blue-500 w-4 h-4"
                          />
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm flex items-center gap-1"><PlusCircle className="w-3 h-3"/> Append (Tambahkan)</span>
                            <span className="text-xs text-muted-foreground">Simpan data lama, tambahkan data baru ini.</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Input 
                        type="file" 
                        accept=".csv"
                        onChange={handleFileChange}
                      />
                      {
                        file && status !== 'uploading' ?
                        <Button variant="ml" className="w-full" onClick={handleFileUpload}>
                          Upload ({uploadMode === 'replace' ? 'Rewrite' : 'Append'})
                        </Button>
                        :
                        <Button variant="ml" className="w-full" disabled>
                          {status === 'uploading' ? 'Sedang Upload...' : 'Upload File'}
                        </Button>
                      }
                    </div>
                  </div>

                  {/* Training Section */}
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg space-y-3 mt-6">
                    <h4 className="font-medium flex items-center gap-2 text-purple-700">
                      <RefreshCw className={`h-5 w-5 ${isTraining ? 'animate-spin' : ''}`} />
                      Proses Prediksi (Training)
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Jalankan algoritma ARIMA & LSTM untuk memperbarui prediksi. Training direkomendasikan setiap kali data berubah.
                    </p>
                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white" 
                      onClick={handleRunTraining}
                      disabled={isTraining}
                    >
                      {isTraining ? 'Sedang Melatih Model...' : 'Mulai Training Data'}
                    </Button>
                  </div>
                </>
              )
            }
              
            {
              role == "OWNER" && (
                <>
                  {/* Export Section */}
                  <div className="p-4 bg-muted/50 rounded-lg space-y-3 border border-muted">
                    <h4 className="font-medium">Export Data</h4>
                    <p className="text-sm text-muted-foreground">
                      Download semua data prediksi dan analisis Anda
                    </p>
                    <Button variant="outline" className="w-full" onClick={handleExportExcel}>Export ke Excel (XLSX)</Button>
                  </div>
                </>
              )
            }  
          </CardContent>
        </Card>
      </div>
    </div>
  );
};