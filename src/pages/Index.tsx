import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { MetricCard } from "@/components/cards/MetricCard";
import { PredictionChart } from "@/components/charts/PredictionChart";
import { useNavigate } from "react-router-dom";
import { 
  BrainCircuit, 
  BarChart3, 
  Database, 
  TrendingUp, 
  Target, 
  Zap,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { useAuthIsAuthenticated } from "@/store/AuthStore";

const Index = () => {
  const navigate = useNavigate();

  const is_authenticated = useAuthIsAuthenticated();

  const features = [
    {
      icon: <BrainCircuit className="h-8 w-8" />,
      title: "Algoritma ARIMA & LSTM",
      description: "Perbandingan dua algoritma machine learning terdepan untuk prediksi time series yang akurat."
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Visualisasi Real-time",
      description: "Dashboard interaktif dengan grafik dan chart yang memudahkan analisis tren penjualan."
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "Analisis Dataset",
      description: "Eksplorasi mendalam terhadap data penjualan dengan insight yang komprehensif."
    }
  ];

  const userAdvantages = [
    "Prediksi akurat dengan tingkat error rendah",
    "Interface yang mudah dipahami dan user-friendly", 
    "Analisis tren penjualan berbasis data historis",
    "Dashboard interaktif untuk monitoring penjualan"
  ];

  const developerAdvantages = [
    "Perbandingan langsung antara algoritma ARIMA vs LSTM",
    "Visualisasi data yang interaktif dan informatif",
    "Akses ke metrik evaluasi model machine learning",
    "Dataset terstruktur dan siap untuk analisis"
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-ml shadow-ml animate-neural-glow mb-6">
              <BrainCircuit className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-ml bg-clip-text text-transparent">
                Sales Predictor
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
              Sistem Prediksi Penjualan dengan Machine Learning
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Platform machine learning untuk analisis dan memprediksi tren penjualan.
            </p>
          </div>


        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-background/50 backdrop-blur">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Fitur Unggulan
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Teknologi machine learning canggih untuk prediksi penjualan yang akurat dan insight bisnis yang mendalam.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-card p-8 rounded-xl shadow-neural border border-ml-primary/10 hover:shadow-ml transition-all duration-300 hover:scale-105"
              >
                <div className="text-ml-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Advantages Section */}
      <section className="py-16 px-4 bg-background/50 backdrop-blur">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Mengapa Sales Predictor?
            </h2>
            <p className="text-lg text-muted-foreground">
              Keunggulan sistem yang dirancang khusus untuk kebutuhan prediksi bisnis modern
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Store Owners */}
            <div className="bg-card p-6 rounded-xl border border-ml-primary/20 shadow-neural">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-gradient-ml">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Untuk Pemilik Toko (Admin)</h3>
              </div>
              <div className="space-y-3">
                {userAdvantages.map((advantage, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{advantage}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* For Developers */}
            <div className="bg-card p-6 rounded-xl border border-ml-secondary/20 shadow-neural">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-gradient-ml">
                  <BrainCircuit className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Untuk Pengembang (Developer)</h3>
              </div>
              <div className="space-y-3">
                {developerAdvantages.map((advantage, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{advantage}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-gradient-ml p-12 rounded-2xl shadow-ml">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Siap Meningkatkan Penjualan?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Jelajahi dashboard lengkap dan mulai analisis prediksi penjualan dengan teknologi machine learning terdepan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {
                is_authenticated() ? (
                  <Button 
                    size="lg" 
                    variant="secondary"
                    onClick={() => navigate("/user/dashboard")}
                    className="bg-white text-ml-primary hover:bg-white/90 text-lg px-8 py-6"
                  >
                    Dashboard
                  </Button>
                ) : (
                  <>
                    <Button 
                      size="lg" 
                      variant="secondary"
                      onClick={() => navigate("/login")}
                      className="bg-white text-ml-primary hover:bg-white/90 text-lg px-8 py-6"
                      >
                      Login
                    </Button>
                    <Button 
                      size="lg" 
                      variant="secondary"
                      onClick={() => navigate("/register")}
                      className="bg-white text-ml-primary hover:bg-white/90 text-lg px-8 py-6"
                      >
                      Sign Up
                    </Button>
                  </>
                )
              }
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t bg-background/80 backdrop-blur">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="mb-6">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-ml flex items-center justify-center">
                <BrainCircuit className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-ml bg-clip-text text-transparent">
                Sales Predictor
              </span>
            </div>
            <p className="text-muted-foreground">
              Sistem Prediksi Penjualan dengan Machine Learning
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>© 2025 Sales Predictor. Rancang Bangun Sistem Prediksi Penjualan</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
