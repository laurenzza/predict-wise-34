import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, ReferenceArea } from 'recharts';

// Komponen Custom untuk Y-Axis agar #Rank berwarna merah untuk Top 3
const CustomYAxisTick = ({ x, y, payload }) => {
  const [name, rank] = payload.value.split("||");
  const isTop3 = parseInt(rank) <= 3;
  
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={4} textAnchor="end" fill="#374151" fontSize={12} fontFamily="sans-serif">
        {name.length > 25 ? `${name.substring(0, 25)}...` : name} 
        <tspan fill={isTop3 ? "#ef4444" : "#9ca3af"} fontWeight="bold" dx={5}>
          #{rank}
        </tspan>
      </text>
    </g>
  );
};

export const Top10PredictionChart = ({ data, targetMonth }) => {
  // Format data untuk mempermudah render label di dalam batang grafik
  const chartData = data.map((item) => ({
    ...item,
    // ID unik untuk Y-Axis yang menyimpan nama dan ranking
    id: `${item.name}||${item.rank}`,
    // Format label yang akan tampil di ujung batang
    revLabel: `Rp${(item.revenue / 1000).toFixed(0)}rb`,
    qtyLabel: `${item.qty} pcs`
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl font-bold text-slate-800">
          Top 10 Produk Prediksi Terjual — {targetMonth || "Bulan Depan"}
        </CardTitle>
        <CardDescription className="text-sm font-semibold text-slate-600">
          Toko Loa Kim Jong | Model PNYB
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="h-[600px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 20, right: 80, left: 20, bottom: 20 }}
              barGap={2}
              barSize={16}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} opacity={0.3} />
              
              {/* Highlight Background Biru Pucat untuk Top 3 */}
              {chartData.length >= 3 && (
                <ReferenceArea 
                  y1={chartData[0].id} 
                  y2={chartData[2].id} 
                  fill="#f0f9ff" 
                  opacity={0.6} 
                />
              )}

              {/* Sumbu X Ganda: Bawah untuk Revenue, Atas (Tersembunyi) untuk Qty */}
              <XAxis 
                type="number" 
                xAxisId="rev" 
                orientation="bottom" 
                tickFormatter={(val) => `Rp${val / 1000}rb`}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#d1d5db' }}
                tickLine={false}
              />
              <XAxis 
                type="number" 
                xAxisId="qty" 
                orientation="top" 
                hide={true} 
              />
              
              <YAxis 
                type="category" 
                dataKey="id" 
                width={220} 
                tick={CustomYAxisTick} 
                axisLine={{ stroke: '#d1d5db' }}
                tickLine={false}
              />
              
              <Tooltip 
                formatter={(value: number, name: string) => [
                  name === "revenue" ? formatCurrency(value) : `${value} pcs`, 
                  name === "revenue" ? "Prediksi pendapatan" : "Prediksi qty terjual"
                ]}
                labelFormatter={(label) => label.split("||")[0]} // Hanya tampilkan nama produk di tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="square"
                formatter={(value) => <span className="text-slate-600 text-sm">{value}</span>}
              />
              
              {/* Batang Biru (Pendapatan / Revenue) */}
              <Bar 
                dataKey="revenue" 
                xAxisId="rev" 
                fill="#4a90e2" 
                name="Prediksi pendapatan (Rp)" 
                radius={[0, 4, 4, 0]}
              >
                <LabelList 
                  dataKey="revLabel" 
                  position="right" 
                  fill="#4a90e2" 
                  fontSize={12} 
                  fontWeight="bold" 
                />
              </Bar>
              
              {/* Batang Hijau (Kuantitas / Qty) */}
              <Bar 
                dataKey="qty" 
                xAxisId="qty" 
                fill="#43b78d" 
                name="Prediksi qty terjual (pcs)" 
                radius={[0, 4, 4, 0]}
              >
                <LabelList 
                  dataKey="qtyLabel" 
                  position="right" 
                  fill="#43b78d" 
                  fontSize={12} 
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};