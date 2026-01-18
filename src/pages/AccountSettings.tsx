import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Added new icons: Play, RefreshCw, Trash2, AlertTriangle, FileText, PlusCircle
import { User, Lock, Database, Eye, EyeOff, Upload, UserCheck, Play, RefreshCw, Trash2, AlertTriangle, FileText, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthChangePassword, useAuthDeleteAccount, useAuthEditProfile, useAuthEmail, useAuthId, useAuthNamaLengkap, useAuthNamaToko, useAuthRole, useAuthToken, useAuthUploadFile } from "@/store/AuthStore";
// Added apiDeleteSales
import { apiPendingUsers, apiRunPrediction, apiSalesSummary, apiUploadSales, apiUserActivation, apiDeleteSales } from "@/api";
import { useSummarizeData } from "@/store/DataSummaryStore";
import { PredictionComparisonBase, useCompare, usePredictionComparisons, usePredictionMetrics, useSevenDaysPrediction, useTotalPredictions } from "@/hooks/usePredictions";
import * as XLSX from "xlsx";

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';
type UploadMode = 'replace' | 'append';

export const AccountSettings = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();

  const user_id = useAuthId();
  const access_token = useAuthToken();
  const namaLengkap = useAuthNamaLengkap();
  const email = useAuthEmail();
  const namaToko = useAuthNamaToko();
  const role = useAuthRole();
  
  const edit_profile = useAuthEditProfile();
  const change_password = useAuthChangePassword();
  const upload_file = useAuthUploadFile();
  const delete_account = useAuthDeleteAccount();
  const summarize_data = useSummarizeData();

  const [namaLengkapForm, setNamaLengkapForm] = useState(namaLengkap);
  const [emailForm, setEmailForm] = useState(email);
  const [namaTokoForm, setNamaTokoForm] = useState(namaToko);
  const [roleForm, setRoleForm] = useState(role);
  const [oldPasswordForm, setOldPasswordForm] = useState("");
  const [newPasswordForm, setNewPasswordForm] = useState("");
  const [confirmPasswordForm, setConfirmPasswordForm] = useState("");
  const [hapusAkunForm, setHapusAkunForm] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  
  // --- NEW STATE ---
  const [isTraining, setIsTraining] = useState(false);
  const [uploadMode, setUploadMode] = useState<UploadMode>('replace');
  const [isDeletingData, setIsDeletingData] = useState(false);
  // -----------------

  // State untuk konfirmasi akun
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [loadingConfirm, setLoadingConfirm] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
    
    // Fetch pending users jika role adalah OWNER
    if (role === "OWNER") {
      fetchPendingUsers();
    }
  }, [searchParams, role]);

  const fetchPendingUsers = async () => {
    try {
      // TODO: Ganti dengan endpoint API Anda yang sebenarnya
      const response = await apiPendingUsers();
      setPendingUsers(response || []);
    } catch (error) {
      console.error("Error fetching pending users:", error);
    }
  };

  const handleConfirmUser = async (userId: number, approve: boolean) => {
    setLoadingConfirm({ ...loadingConfirm, [userId]: true });
    try {
      // TODO: Ganti dengan endpoint API Anda yang sebenarnya
      // const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/confirm-user`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${access_token}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ user_id: userId, approve })
      // });
      
      // const data = await response.json();

      console.log(userId)
      const response = await apiUserActivation(userId, approve);
      console.log(response)
      
      toast({
        title: approve ? "Akun Diaktivasi" : "Akun Ditolak",
        description: approve 
          ? "Pengguna dapat login sekarang" 
          : "Akun pengguna telah ditolak"
      });
      
      // Refresh daftar pending users
      fetchPendingUsers();
    } catch (error) {
      console.error("Error confirming user:", error);
      toast({
        title: "Gagal Memproses",
        description: "Terjadi kesalahan saat memproses konfirmasi",
        variant: "destructive"
      });
    } finally {
      setLoadingConfirm({ ...loadingConfirm, [userId]: false });
    }
  };

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await edit_profile(emailForm, namaLengkapForm, namaTokoForm, roleForm);

      if(response){
        toast({
          title: "Berhasil Mengubah Profile"
        })
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if(newPasswordForm != confirmPasswordForm){
      toast({
        title: "Password Tidak Cocok!",
        description: "Ulangi konfirmasi password"
      });
      setConfirmPasswordForm("");
      return;
    }

    try {
      const response = await change_password(oldPasswordForm, newPasswordForm);

      if(response){
        toast({
          title: "Berhasil Mengubah Password"
        })
        setOldPasswordForm("");
        setNewPasswordForm("");
        setConfirmPasswordForm("");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Gagal Mengubah Password",
        description: "Silakan coba lagi"
      })
    }
  }

  const handleHapusAkun = async (e: React.FormEvent) => {
    try {
      if(hapusAkunForm != "HAPUS AKUN"){
        toast({
          title: "Konfirmasi Diperlukan",
          description: "Pastikan Anda telah mengetik 'HAPUS AKUN' dengan benar.",
          variant: "destructive"
        });
        return;
      }
    
      const response = await delete_account();

      if(response["message"] == "success"){
        toast({
          title: "Berhasil Menghapus Akun Anda",
          description: "Sampai jumpa lagi"
        })
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Gagal hapus akun",
        description: "Yakin ingin hapus akun anda?"
      })
    }
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      toast({
        title: "File Berhasil Dipilih",
        description: `File: ${e.target.files[0].name}`,
      });
    }
    else{
      setFile(null);
    }
  }

  // --- MODIFIED: Handle File Upload with Mode ---
  const handleFileUpload = async (e: React.FormEvent) => {
    if(!file) return;

    setStatus('uploading');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', uploadMode); // Append selected mode

    try {
      await upload_file(formData);
      await summarize_data(user_id, access_token);
      // Removed automatic prediction run:
      // const response2 = await apiRunPrediction();
      // await summarize_data(user_id, access_token);

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
        description: "Perhatikan format file dan coba lagi"
      })
    }
  }

  // --- NEW: Handle Training Manually ---
  const handleRunTraining = async () => {
    setIsTraining(true);
    try {
      await apiRunPrediction();
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

  // --- NEW: Handle Delete All Data ---
  const handleDeleteAllData = async () => {
    if(!confirm("PERINGATAN: Apakah Anda yakin ingin menghapus SEMUA data penjualan? Tindakan ini tidak bisa dibatalkan.")) {
      return;
    }

    setIsDeletingData(true);
    try {
      // Calls the API endpoint to clear data
      await apiDeleteSales(); 

      toast({
        title: "Data Dihapus",
        description: "Semua data penjualan telah dibersihkan dari database.",
        variant: "destructive"
      });
      
      // Optional: Refresh page
      // window.location.reload(); 
      
    } catch (error) {
      console.error("Error deleting data:", error);
      toast({
        title: "Gagal Menghapus Data",
        description: "Terjadi kesalahan server.",
        variant: "destructive"
      });
    } finally {
      setIsDeletingData(false);
    }
  }

  const { data: data_total, isLoading: is_loading_total, isError: is_error_total } = useSevenDaysPrediction(new Date().toISOString().split('T')[0]);
  const { data: data_comparisons, isLoading: is_loading_comparisons, isError: is_error_comparisons } = useCompare();
  const { data: data_metrics, isLoading: is_loading_metrics, isError: is_error_metrics } = usePredictionMetrics();

  const nama_toko = useAuthNamaToko();

  const handleExportExcel = () => {
    if (!data_total || !data_comparisons || !data_metrics) {
      alert("Data belum siap untuk diekspor!");
      return;
    }

    // 1️⃣ Total Predictions Sheet
    const totalSheetData = data_total["predictions"].map((item: any, index: number) => ({
      No: index + 1,
      Tanggal: new Date(item["date"]).toLocaleDateString("id-ID"),
      "Total Penjualan ARIMA": item["ARIMA"]["value"],
      "Total Penjualan LSTM": item["LSTM"]["value"],
      "Selisih": Math.abs(item["ARIMA"]["value"] - item["LSTM"]["value"])
    }));
    const totalSheet = XLSX.utils.json_to_sheet(totalSheetData);

    // 2️⃣ Prediction Comparisons Sheet
    const comparisonSheetData = data_comparisons["data"].map((item: PredictionComparisonBase) => ({
      Hari: item["day"],
      Aktual: item["actual"],
      ARIMA: item["arima_pred"],
      LSTM: item["lstm_pred"],
    }));
    const comparisonSheet = XLSX.utils.json_to_sheet(comparisonSheetData);

    // 3️⃣ Prediction Metrics Sheet
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

    // 4️⃣ Buat workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, totalSheet, "Total Predictions");
    XLSX.utils.book_append_sheet(workbook, comparisonSheet, "Prediction Comparisons");
    XLSX.utils.book_append_sheet(workbook, metricSheet, "Prediction Metrics");

    // 5️⃣ Simpan file
    if(nama_toko != ""){
      XLSX.writeFile(workbook, `Prediksi Toko ${nama_toko}.xlsx`);
    }
    else{
      XLSX.writeFile(workbook, "Prediksi Toko.xlsx");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pengaturan Akun</h1>
          <p className="text-gray-600">Kelola informasi akun dan preferensi Anda</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className={`grid w-full ${role === "OWNER" ? "grid-cols-5" : "grid-cols-4"}`}>
            <TabsTrigger value="profile" className="gap-2 data-[state=active]:bg-ml-primary/10 data-[state=active]:text-ml-primary">
              <User className="w-4 h-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2 data-[state=active]:bg-ml-primary/10 data-[state=active]:text-ml-primary">
              <Lock className="w-4 h-4" />
              Keamanan
            </TabsTrigger>
            <TabsTrigger value="data" className="gap-2 data-[state=active]:bg-ml-primary/10 data-[state=active]:text-ml-primary">
              <Database className="w-4 h-4" />
              Data
            </TabsTrigger>
            {role === "OWNER" && (
              <TabsTrigger value="confirm" className="gap-2 data-[state=active]:bg-ml-primary/10 data-[state=active]:text-ml-primary">
                <UserCheck className="w-4 h-4" />
                Konfirmasi
              </TabsTrigger>
            )}
            <TabsTrigger value="delete" className="gap-2 data-[state=active]:bg-destructive/10 data-[state=active]:text-destructive">
              <User className="w-4 h-4" />
              Hapus Akun
            </TabsTrigger>
          </TabsList>
          {/* <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="gap-2 data-[state=active]:bg-ml-primary/10 data-[state=active]:text-ml-primary">
              <User className="h-4 w-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2 data-[state=active]:bg-ml-primary/10 data-[state=active]:text-ml-primary">
              <Lock className="h-4 w-4" />
              Keamanan
            </TabsTrigger>
            <TabsTrigger value="data" className="gap-2 data-[state=active]:bg-ml-primary/10 data-[state=active]:text-ml-primary">
              <Database className="h-4 w-4" />
              Data
            </TabsTrigger>
            <TabsTrigger value="delete" className="gap-2 data-[state=active]:bg-destructive/10 data-[state=active]:text-destructive">
              <User className="h-4 w-4" />
              Hapus Akun
            </TabsTrigger>
          </TabsList> */}

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Profil</CardTitle>
                <CardDescription>
                  Update informasi profil dan detail akun Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input id="name" placeholder="Masukkan nama lengkap" value={namaLengkapForm} onChange={(e) => setNamaLengkapForm(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="email@example.com" value={emailForm} onChange={(e) => setEmailForm(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Nama Toko</Label>
                  <Input id="company" placeholder="Loa Kim Jong" value={namaTokoForm} onChange={(e) => setNamaTokoForm(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" value={roleForm} disabled />
                </div>
                <Button variant="ml" onClick={handleProfileSubmit}>Simpan Perubahan</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Keamanan Akun</CardTitle>
                <CardDescription>
                  Kelola password dan pengaturan keamanan akun
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Password Saat Ini</Label>
                  <div className="relative">
                    <Input 
                      id="current-password" 
                      type={showCurrentPassword ? "text" : "password"}
                      value={oldPasswordForm}
                      onChange={(e) => setOldPasswordForm(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Password Baru</Label>
                  <div className="relative">
                    <Input 
                      id="new-password" 
                      type={showNewPassword ? "text" : "password"} 
                      value={newPasswordForm}
                      onChange={(e) => setNewPasswordForm(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Konfirmasi Password Baru</Label>
                  <div className="relative">
                    <Input 
                      id="confirm-password" 
                      type={showConfirmPassword ? "text" : "password"} 
                      value={confirmPasswordForm}
                      onChange={(e) => setConfirmPasswordForm(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button variant="ml" onClick={handleChangePassword}>Update Password</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Tab - MODIFIED */}
          <TabsContent value="data">
            <Card>
              <CardHeader>
                <CardTitle>Manajemen Data</CardTitle>
                <CardDescription>
                  Download data penjualan Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* 1. Upload Section (Modified with Radio Buttons) */}
                <div className="p-4 bg-ml-primary/5 border border-ml-primary/20 rounded-lg space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Upload className="h-5 w-5 text-ml-primary" />
                    Upload Data Penjualan
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Upload file CSV dengan kolom: Tanggal Pembayaran, Status Terakhir, Nama Produk, Jumlah Produk Dibeli, Harga Jual, Total Penjualan
                  </p>

                   {/* Mode Upload Selection */}
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
                        {status === 'uploading' ? 'Sedang Upload...' : 'Upload & Perbarui Data'}
                      </Button>
                    }
                  </div>
                </div>

                {/* 2. Training Section (NEW) */}
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg space-y-3">
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
                
                {/* 3. Export Section */}
                <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                  <h4 className="font-medium">Export Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Download semua data prediksi dan analisis Anda
                  </p>
                  <Button variant="outline" className="w-full" onClick={handleExportExcel}>Export ke CSV</Button>
                </div>

                {/* 4. Delete Data (NEW) */}
                {/* <div className="p-4 border border-red-200 bg-red-50/30 rounded-lg flex items-center justify-between">
                    <div className="space-y-1">
                        <h4 className="font-medium text-red-900 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" /> Danger Zone
                        </h4>
                        <p className="text-xs text-red-600/80 max-w-md">
                            Hapus semua data penjualan dari database. Riwayat prediksi akan hilang.
                        </p>
                    </div>
                    <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={handleDeleteAllData}
                        disabled={isDeletingData}
                    >
                        {isDeletingData ? 'Menghapus...' : (
                            <span className="flex items-center gap-2"><Trash2 className="w-4 h-4" /> Hapus Data</span>
                        )}
                    </Button>
                </div> */}

              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Konfirmasi Akun - Hanya untuk OWNER */}
          {role === "OWNER" && (
            <TabsContent value="confirm" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Konfirmasi Akun Karyawan</CardTitle>
                  <CardDescription>
                    Setujui atau tolak pendaftaran akun karyawan baru
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pendingUsers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <UserCheck className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Tidak ada akun yang menunggu konfirmasi</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {pendingUsers.map((user) => (
                        <Card key={user.user_id} className="border-2">
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-muted-foreground" />
                                  <h4 className="font-semibold">{user.nama_lengkap || 'N/A'}</h4>
                                </div>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                <div className="flex gap-4 text-sm mt-2">
                                  {/* <span className="text-muted-foreground">
                                    <strong>Nama Toko:</strong> {user.nama_toko || 'N/A'}
                                  </span> */}
                                  <span className="text-muted-foreground">
                                    <strong>Role:</strong> {user.role}
                                  </span>
                                </div>
                                {/* <p className="text-xs text-muted-foreground mt-1">
                                  Didaftarkan: {new Date(user.created_at).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p> */}
                              </div>
                              {
                                user.role === "OWNER" ? (
                                    <Button
                                      // onClick={() => handleConfirmUser(user.user_id, true)}
                                      size="sm"
                                      className="bg-gray-600"
                                      disabled
                                    >
                                      Hubungi developer
                                    </Button>
                                ) : (
                                  <div className="flex gap-2 ml-4">
                                    <Button
                                      onClick={() => handleConfirmUser(user.user_id, true)}
                                      disabled={loadingConfirm[user.user_id]}
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      {loadingConfirm[user.user_id] ? 'Memproses...' : 'Setujui'}
                                    </Button>
                                    <Button
                                      onClick={() => handleConfirmUser(user.user_id, false)}
                                      disabled={loadingConfirm[user.user_id]}
                                      variant="destructive"
                                      size="sm"
                                    >
                                      {loadingConfirm[user.user_id] ? 'Memproses...' : 'Tolak'}
                                    </Button>
                                  </div>
                                )
                              }
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Delete Account Tab */}
          <TabsContent value="delete">
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Hapus Akun</CardTitle>
                <CardDescription>
                  Hapus akun Anda secara permanen. Tindakan ini tidak dapat dibatalkan.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg space-y-3">
                  <h4 className="font-medium text-destructive">Peringatan</h4>
                  <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                    <li>Semua data penjualan Anda akan dihapus secara permanen</li>
                    <li>Riwayat prediksi dan analisis tidak dapat dipulihkan</li>
                    <li>Akun tidak dapat diaktifkan kembali setelah dihapus</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-delete">Ketik "HAPUS AKUN" untuk konfirmasi</Label>
                  <Input 
                    id="confirm-delete" 
                    placeholder="HAPUS AKUN"
                    value={hapusAkunForm}
                    onChange={(e) => setHapusAkunForm(e.target.value)}
                  />
                </div>

                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={handleHapusAkun}
                >
                  Hapus Akun Saya Secara Permanen
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AccountSettings;