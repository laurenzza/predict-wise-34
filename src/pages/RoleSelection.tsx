import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Shield, BarChart3, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const RoleSelection = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role: 'admin' | 'developer') => {
    // Store role in localStorage for persistence
    // localStorage.setItem('userRole', role);
    
    navigate('/login');
    // if (role === 'admin') {
    //   // navigate('/admin-dashboard');
    //   navigate('/admin-login');
    // } else {
    //   // navigate('/developer-dashboard');
    //   navigate('/developer-login');
    // }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Pilih <span className="bg-gradient-ml bg-clip-text text-transparent">Role Akses</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Silakan pilih jenis akses yang sesuai dengan kebutuhan Anda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Admin Role Card */}
          <Card className="shadow-neural border-ml-primary/20 hover:shadow-ml transition-all duration-300 cursor-pointer group" 
                onClick={() => handleRoleSelection('admin')}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-gradient-subtle rounded-full w-fit group-hover:scale-110 transition-transform">
                <User className="h-8 w-8 text-ml-primary" />
              </div>
              <CardTitle className="text-2xl">ADMIN</CardTitle>
              <CardDescription className="text-base">
                Akses untuk admin dengan fitur prediksi penjualan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <BarChart3 className="h-4 w-4 text-ml-accent" />
                <span>Prediksi Penjualan 7 & 30 Hari</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <BarChart3 className="h-4 w-4 text-ml-accent" />
                <span>Dataset & Statistik Toko</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <BarChart3 className="h-4 w-4 text-ml-accent" />
                <span>Periode Analisis</span>
              </div>
              
              <Button 
                className="w-full mt-6 bg-gradient-ml hover:shadow-ml"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRoleSelection('admin');
                }}
              >
                Masuk sebagai Admin
              </Button>
            </CardContent>
          </Card>

          {/* Developer Role Card */}
          <Card className="shadow-neural border-ml-primary/20 hover:shadow-ml transition-all duration-300 cursor-pointer group"
                onClick={() => handleRoleSelection('developer')}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-gradient-subtle rounded-full w-fit group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8 text-ml-primary" />
              </div>
              <CardTitle className="text-2xl">DEVELOPER</CardTitle>
              <CardDescription className="text-base">
                Akses lengkap untuk monitoring dan analisis model ML
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Settings className="h-4 w-4 text-ml-accent" />
                <span>Monitoring Model ARIMA vs LSTM</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Settings className="h-4 w-4 text-ml-accent" />
                <span>Perbandingan Performa Model</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Settings className="h-4 w-4 text-ml-accent" />
                <span>Insights & Rekomendasi</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Settings className="h-4 w-4 text-ml-accent" />
                <span>Kualitas Data & Training</span>
              </div>
              
              <Button 
                variant="secondary" 
                className="w-full mt-6"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRoleSelection('developer');
                }}
              >
                Masuk sebagai Developer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};