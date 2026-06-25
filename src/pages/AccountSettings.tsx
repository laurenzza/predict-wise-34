import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, Eye, EyeOff, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthChangePassword, useAuthDeleteAccount, useAuthEditProfile, useAuthEmail, useAuthId, useAuthNamaLengkap, useAuthNamaToko, useAuthRole, useAuthToken } from "@/store/AuthStore";
import { apiPendingUsers, apiUserActivation } from "@/api";

export const AccountSettings = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();

  const access_token = useAuthToken();
  const namaLengkap = useAuthNamaLengkap();
  const email = useAuthEmail();
  const namaToko = useAuthNamaToko();
  const role = useAuthRole();
  
  const edit_profile = useAuthEditProfile();
  const change_password = useAuthChangePassword();
  const delete_account = useAuthDeleteAccount();

  const [namaLengkapForm, setNamaLengkapForm] = useState(namaLengkap);
  const [emailForm, setEmailForm] = useState(email);
  const [namaTokoForm, setNamaTokoForm] = useState(namaToko);
  const [roleForm, setRoleForm] = useState(role);
  const [oldPasswordForm, setOldPasswordForm] = useState("");
  const [newPasswordForm, setNewPasswordForm] = useState("");
  const [confirmPasswordForm, setConfirmPasswordForm] = useState("");
  const [hapusAkunForm, setHapusAkunForm] = useState("");

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
      const response = await apiPendingUsers();
      setPendingUsers(response || []);
    } catch (error) {
      console.error("Error fetching pending users:", error);
    }
  };

  const handleConfirmUser = async (userId: number, approve: boolean) => {
    setLoadingConfirm({ ...loadingConfirm, [userId]: true });
    try {
      await apiUserActivation(userId, approve);
      
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pengaturan Akun</h1>
          <p className="text-gray-600">Kelola informasi akun dan preferensi Anda</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className={`grid w-full ${role === "OWNER" ? "grid-cols-4" : "grid-cols-3"}`}>
            <TabsTrigger value="profile" className="gap-2 data-[state=active]:bg-ml-primary/10 data-[state=active]:text-ml-primary">
              <User className="w-4 h-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2 data-[state=active]:bg-ml-primary/10 data-[state=active]:text-ml-primary">
              <Lock className="w-4 h-4" />
              Keamanan
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
                      {showCurrentPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
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
                      {showNewPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
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
                      {showConfirmPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                  </div>
                </div>
                <Button variant="ml" onClick={handleChangePassword}>Update Password</Button>
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
                                  <span className="text-muted-foreground">
                                    <strong>Role:</strong> {user.role}
                                  </span>
                                </div>
                              </div>
                              {
                                user.role === "OWNER" ? (
                                    <Button size="sm" className="bg-gray-600" disabled>
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