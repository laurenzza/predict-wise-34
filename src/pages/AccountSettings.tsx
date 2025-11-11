import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, Database, Eye, EyeOff, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthChangePassword, useAuthDeleteAccount, useAuthEditProfile, useAuthEmail, useAuthId, useAuthNamaLengkap, useAuthNamaToko, useAuthRole, useAuthToken, useAuthUploadFile } from "@/store/AuthStore";
import { apiRunPrediction, apiSalesSummary, apiUploadSales } from "@/api";
import { useSummarizeData } from "@/store/DataSummaryStore";
import { PredictionComparisonBase, usePredictionComparisons, usePredictionMetrics, useTotalPredictions } from "@/hooks/usePredictions";
import * as XLSX from "xlsx";

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export const AccountSettings = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("profile");
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

  const handleFileUpload = async (e: React.FormEvent) => {
    if(!file) return;

    setStatus('uploading');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await upload_file(formData);
      const response2 = await apiRunPrediction();
      await summarize_data(user_id, access_token);

      setStatus("success");
      toast({
        title: "Berhasil Upload File",
        description: "Data sedang diproses"
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

  const { data: data_total, isLoading: is_loading_total, isError: is_error_total } = useTotalPredictions();
  const { data: data_comparisons, isLoading: is_loading_comparisons, isError: is_error_comparisons } = usePredictionComparisons();
  const { data: data_metrics, isLoading: is_loading_metrics, isError: is_error_metrics } = usePredictionMetrics();

  const nama_toko = useAuthNamaToko();

  const handleExportExcel = () => {
    if (!data_total || !data_comparisons || !data_metrics) {
      alert("Data belum siap untuk diekspor!");
      return;
    }

    // 1️⃣ Total Predictions Sheet
    const totalSheetData = data_total.data.map((item: any, index: number) => ({
      No: index + 1,
      Tanggal: new Date(item.hasil_tanggal).toLocaleDateString("id-ID"),
      "Total Penjualan ARIMA": item.hasil_total_penjualan_arima,
      "Total Penjualan LSTM": item.hasil_total_penjualan_lstm,
      "Selisih": Math.abs(item.hasil_total_penjualan_arima - item.hasil_total_penjualan_lstm)
    }));
    const totalSheet = XLSX.utils.json_to_sheet(totalSheetData);

    // 2️⃣ Prediction Comparisons Sheet
    const comparisonSheetData = data_comparisons.data.map((item: PredictionComparisonBase) => ({
      Hari: item.hari,
      Aktual: item.hasil_total_penjualan_aktual,
      ARIMA: item.hasil_total_penjualan_arima,
      LSTM: item.hasil_total_penjualan_lstm,
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
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Pengaturan Akun</h1>
          <p className="text-muted-foreground">
            Kelola informasi akun dan preferensi Anda
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
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
          </TabsList>

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

          {/* Data Tab */}
          <TabsContent value="data">
            <Card>
              <CardHeader>
                <CardTitle>Manajemen Data</CardTitle>
                <CardDescription>
                  Upload dan kelola data penjualan Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-ml-primary/5 border border-ml-primary/20 rounded-lg space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Upload className="h-5 w-5 text-ml-primary" />
                    Upload Data Penjualan
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Upload file CSV dengan kolom: Tanggal Pembayaran, Status Terakhir, Nama Produk, Jumlah Produk Dibeli, Harga Jual, Total Penjualan
                  </p>
                  <div className="flex flex-col gap-2">
                    <Input 
                      type="file" 
                      accept=".csv"
                      onChange={handleFileChange}
                    />
                    {
                      file && status !== 'uploading' ?
                      <Button variant="ml" className="w-full" onClick={handleFileUpload}>
                        Upload & Perbarui Data
                      </Button>
                      :
                      <Button variant="ml" className="w-full" disabled>
                        Upload & Perbarui Data
                      </Button>
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Data akan langsung diproses dan digunakan untuk prediksi real-time
                  </p>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                  <h4 className="font-medium">Export Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Download semua data prediksi dan analisis Anda
                  </p>
                  <Button variant="outline" onClick={handleExportExcel}>Export ke CSV</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

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
