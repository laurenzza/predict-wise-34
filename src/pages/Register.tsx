import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BrainCircuit, Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRegister } from "@/api";
import { useAuthRegister } from "@/store/AuthStore";

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const register = useAuthRegister();

  const navigate = useNavigate();
  const { toast } = useToast();

  const [role, setRole] = useState<"ADMIN" | "DEVELOPER">("ADMIN");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [konfirmasi, setKonfirmasi] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if(password.length < 8){
      setIsLoading(false);
      toast({
        title: "Password Kurang dari 8 Karakter!",
        description: "Perkuat password anda",
      });
      setKonfirmasi("");
      return;
    }
    
    if(password != konfirmasi){
      setIsLoading(false);
      toast({
        title: "Password Tidak Cocok!",
        description: "Ulangi konfirmasi password"
      });
      setKonfirmasi("");
      return;
    }

    try {
      // const response = await apiRegister(email, namaLengkap, password, role);
      const response = await register(email, namaLengkap, password, role);
      
      // Simulate registration process
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Registrasi Berhasil",
          description: "Silakan upload data penjualan untuk memulai.",
        });
        navigate("/user/dashboard");
      }, 2000);
    } catch (error) {
      console.error(error);
      if(error.response?.status == 409){
        toast({
          title: "Registrasi Gagal!",
          description: "Email sudah digunakan, silakan gunakan email lain"
        })
      }
      setIsLoading(false);
    }
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-xl bg-gradient-ml flex items-center justify-center animate-neural-glow">
              <BrainCircuit className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-ml bg-clip-text text-transparent">
            Sales Predictor
          </h1>
          <p className="text-muted-foreground">
            Bergabung untuk akses sistem prediksi
          </p>
        </div>

        {/* Registration Form */}
        <Card className="shadow-ml border-ml-primary/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Register</CardTitle>
            <CardDescription className="text-center">
              Buat akun baru untuk mengakses fitur prediksi penjualan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    className="pl-10"
                    value={namaLengkap}
                    onChange={(e) => setNamaLengkap(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimal 8 karakter"
                    className="pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Ulangi password"
                    className="pl-10 pr-10"
                    value={konfirmasi}
                    onChange={(e) => setKonfirmasi(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 p-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* <div className="space-y-2">
                <Label>Role</Label>
                <RadioGroup value={role} onValueChange={(value) => setRole(value as "ADMIN" | "DEVELOPER")} hidden>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ADMIN" id="ADMIN" />
                    <Label htmlFor="ADMIN" className="font-normal cursor-pointer">Admin</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="DEVELOPER" id="DEVELOPER" />
                    <Label htmlFor="DEVELOPER" className="font-normal cursor-pointer">Developer</Label>
                  </div>
                </RadioGroup>
              </div> */}

              <Button 
                type="submit" 
                className="w-full" 
                variant="ml"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Membuat akun...</span>
                  </div>
                ) : (
                  "Register"
                )}
              </Button>

              {/* <Button 
                type="button" 
                className="w-full" 
                variant="outline"
                onClick={() => navigate("/role-selection")}
              >
                Demo Mode
              </Button> */}
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Sudah punya akun? </span>
              <Button
                variant="link"
                className="p-0 h-auto text-ml-primary"
                onClick={() => navigate("/login")}
              >
                Log In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};