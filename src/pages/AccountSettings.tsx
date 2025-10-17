import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, Database, Eye, EyeOff, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const AccountSettings = () => {
  const [searchParams] = useSearchParams();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("profile");
  const { toast } = useToast();

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

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
                  <Input id="name" placeholder="Masukkan nama lengkap" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="email@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Nama Toko</Label>
                  <Input id="company" placeholder="Loa Kim Jong" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" value="User" disabled />
                </div>
                <Button variant="ml">Simpan Perubahan</Button>
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
                <Button variant="ml">Update Password</Button>
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
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          toast({
                            title: "File Berhasil Dipilih",
                            description: `File: ${e.target.files[0].name}`,
                          });
                        }
                      }}
                    />
                    <Button variant="ml" className="w-full">
                      Upload & Perbarui Data
                    </Button>
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
                  <Button variant="outline">Export ke CSV</Button>
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
                  />
                </div>

                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: "Konfirmasi Diperlukan",
                      description: "Pastikan Anda telah mengetik 'HAPUS AKUN' dengan benar.",
                      variant: "destructive"
                    });
                  }}
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
