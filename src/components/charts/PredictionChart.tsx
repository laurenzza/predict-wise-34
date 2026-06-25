import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PredictionComparisonBase, PredictionComparisons } from "@/hooks/usePredictions";

// const predictionData = [
//   { day: 1, arima: 220215, lstm: 218500, actual: 220000 },
//   { day: 2, arima: 220131, lstm: 218200, actual: 219800 },
//   { day: 3, arima: 219943, lstm: 217950, actual: 219500 },
//   { day: 4, arima: 219676, lstm: 217700, actual: 219200 },
//   { day: 5, arima: 219364, lstm: 217450, actual: 218900 },
//   { day: 6, arima: 218986, lstm: 217200, actual: 218600 },
//   { day: 7, arima: 218831, lstm: 216950, actual: 218300 },
//   { day: 8, arima: 218354, lstm: 216700, actual: 218000 },
//   { day: 9, arima: 217867, lstm: 216450, actual: 217700 },
//   { day: 10, arima: 217493, lstm: 216200, actual: 217400 },
// ];

export const PredictionChartMonthly = ({ data }) => {
  const predictionData = [];

  // Transformasi data API ke format Recharts
  data.forEach((row) => {
    predictionData.push({
      period: row["period"],
      arima: row["arima_pred"],
      lstm: row["lstm_pred"],
      ensemble: row["ensemble_pred"],
      // Set actual ke null jika itu adalah bulan prediksi, agar garis terputus rapi
      actual: row["type"] === "Forecast" ? null : row["actual"]
    });
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatMonthLabel = (value: string) => {
    if (!value) return "";
    
    // Pecah string untuk memisahkan "2025-04" dan " (Prediksi)" jika ada
    const parts = value.split(" ");
    const datePart = parts[0]; 
    const [year, month] = datePart.split("-");
    
    // Array singkatan nama bulan
    const months = ["", "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
    const monthName = months[parseInt(month, 10)];
    
    // Gabungkan kembali dengan suffix " (Prediksi)" jika aslinya memiliki suffix tersebut
    const suffix = parts.length > 1 ? ` ${parts.slice(1).join(" ")}` : "";
    return `${monthName} ${year}${suffix}`;
  };

  return (
    <Card className="shadow-neural border-ml-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-gradient-ml animate-ml-pulse"></div>
          Tren Pendapatan Bulanan (6 Bulan + 1 Bulan Prediksi)
        </CardTitle>
        <CardDescription>
          Visualisasi perbandingan aktual historis dengan prediksi model ARIMA, LSTM, dan Ensemble PNYB.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={predictionData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="period" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatMonthLabel}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} // Format ke Juta (M)
              />
              
              {/* PERBAIKAN: Formatter Tooltip yang lebih sederhana dan akurat */}
              <Tooltip 
                formatter={(value: number, name: string) => [
                  formatCurrency(value), 
                  name 
                ]}
                labelFormatter={(label) => `Bulan: ${formatMonthLabel(label)}`}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              
              {/* Garis Data Aktual */}
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="hsl(var(--foreground))" 
                strokeWidth={3}
                connectNulls={false} 
                dot={{ fill: "hsl(var(--foreground))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
                name="Data Aktual"
              />
              
              {/* PERBAIKAN: Garis Ensemble (Warna Lavender & Putus-putus) */}
              <Line 
                type="monotone" 
                dataKey="ensemble" 
                stroke="#9370db" 
                strokeDasharray="7 7"
                strokeWidth={3}
                dot={{ fill: "#9370db", strokeWidth: 2, r: 4 }}
                name="Ensemble (PNYB)"
              />

              {/* Garis ARIMA */}
              <Line 
                type="monotone" 
                dataKey="arima" 
                stroke="hsl(var(--arima-color, #f59e0b))" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "hsl(var(--arima-color, #f59e0b))", strokeWidth: 2, r: 3 }}
                name="ARIMA"
              />
              
              {/* Garis LSTM */}
              <Line 
                type="monotone" 
                dataKey="lstm" 
                stroke="hsl(var(--lstm-color, #3b82f6))" 
                strokeWidth={2}
                strokeDasharray="10 5"
                dot={{ fill: "hsl(var(--lstm-color, #3b82f6))", strokeWidth: 2, r: 3 }}
                name="LSTM"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export const PredictionChart = ({ data }) => {
  const predictionData = []

  data.forEach((row) => {
    predictionData.push({
      day: row["day"],
      arima: row["arima_pred"],
      lstm: row["lstm_pred"],
      actual: row["actual"]
    })
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="shadow-neural border-ml-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-gradient-ml animate-ml-pulse"></div>
          Perbandingan Prediksi ARIMA vs LSTM
        </CardTitle>
        <CardDescription>
          Visualisasi perbandingan akurasi prediksi antara algoritma ARIMA dan LSTM
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={predictionData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  formatCurrency(value), 
                  name
                ]}
                labelFormatter={(label) => `Hari ${label}`}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="hsl(var(--foreground))" 
                strokeWidth={3}
                dot={{ fill: "hsl(var(--foreground))", strokeWidth: 2, r: 4 }}
                name="Data Aktual"
              />
              <Line 
                type="monotone" 
                dataKey="arima" 
                stroke="hsl(var(--arima-color))" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "hsl(var(--arima-color))", strokeWidth: 2, r: 3 }}
                name="ARIMA"
              />
              <Line 
                type="monotone" 
                dataKey="lstm" 
                stroke="hsl(var(--lstm-color))" 
                strokeWidth={2}
                strokeDasharray="10 5"
                dot={{ fill: "hsl(var(--lstm-color))", strokeWidth: 2, r: 3 }}
                name="LSTM"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};