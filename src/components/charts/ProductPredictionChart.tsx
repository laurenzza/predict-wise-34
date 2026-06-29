import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LabelList, 
  ReferenceArea 
} from 'recharts';

// ============================================================================
// 1. KOMPONEN CUSTOM UNTUK LABEL Y-AXIS
// ============================================================================
interface CustomYAxisTickProps {
  x?: number;
  y?: number;
  payload?: {
    value: string;
  };
}

const CustomYAxisTick: React.FC<CustomYAxisTickProps> = ({ x, y, payload }) => {
  if (!payload || !payload.value) return <g></g>;

  const [name, rank] = payload.value.split("||");
  const isTop3 = parseInt(rank) <= 3;
  
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={4} textAnchor="end" fill="#374151" fontSize={12} fontFamily="sans-serif">
        {name.length > 22 ? `${name.substring(0, 22)}...` : name} 
        <tspan fill={isTop3 ? "#ef4444" : "#9ca3af"} fontWeight="bold" dx={5}>
          #{rank}
        </tspan>
      </text>
    </g>
  );
};

// ============================================================================
// 2. KOMPONEN GRAFIK TOP 10 (Recharts)
// ============================================================================
export const Top10PredictionChart = ({ data, sortBy }: { data: any[], sortBy: 'revenue' | 'qty' }) => {
  const chartData = data.map((item) => ({
    ...item,
    id: `${item.name}||${item.rank}`,
    revLabel: `Rp${(item.revenue / 1000).toFixed(0)}rb`,
    qtyLabel: `${item.qty} pcs`
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="shadow-neural border-ml-primary/20 mb-8">
      <CardHeader className="text-center pb-4 border-b border-slate-100 mb-4">
        <CardTitle className="text-xl font-bold text-slate-800 flex items-center justify-center gap-2">
          <TrendingUp className="h-5 w-5 text-ml-primary" />
          Top 10 Produk Prediksi Terjual
        </CardTitle>
        <CardDescription className="text-sm font-semibold text-slate-600 mt-1">
          Berdasarkan {sortBy === 'revenue' ? "Pendapatan (Revenue)" : "Kuantitas (Qty)"}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="h-[600px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 20, right: 80, left: 10, bottom: 20 }}
              barGap={2}
              barSize={16}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} opacity={0.3} />
              
              {chartData.length >= 3 && (
                <ReferenceArea y1={chartData[0].id} y2={chartData[2].id} fill="#f0f9ff" opacity={0.6} />
              )}

              <XAxis type="number" xAxisId="rev" orientation="bottom" tickFormatter={(val) => `Rp${val / 1000}rb`} tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#d1d5db' }} tickLine={false} />
              <XAxis type="number" xAxisId="qty" orientation="top" hide={true} />
              <YAxis 
                type="category" 
                dataKey="id" 
                width={210} 
                tick={(tickProps: any) => <CustomYAxisTick {...tickProps} />} 
                axisLine={{ stroke: '#d1d5db' }} 
                tickLine={false} 
              />
              
              <Tooltip 
                formatter={(value: number, name: string) => {
                  const isRevenue = name === "Prediksi pendapatan (Rp)";
                  return [
                    isRevenue ? formatCurrency(value) : `${value} pcs`, 
                    name 
                  ];
                }}
                labelFormatter={(label: string) => label.split("||")[0]}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="square" formatter={(value) => <span className="text-slate-600 text-sm font-medium ml-1">{value}</span>} />
              
              <Bar dataKey="revenue" xAxisId="rev" fill="#4a90e2" name="Prediksi pendapatan (Rp)" radius={[0, 4, 4, 0]}>
                <LabelList dataKey="revLabel" position="right" fill="#4a90e2" fontSize={12} fontWeight="bold" />
              </Bar>
              <Bar dataKey="qty" xAxisId="qty" fill="#43b78d" name="Prediksi qty terjual (pcs)" radius={[0, 4, 4, 0]}>
                <LabelList dataKey="qtyLabel" position="right" fill="#43b78d" fontSize={12} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};