import { 
  TrendingUp,
  PackageOpen
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
// 1. KOMPONEN CUSTOM UNTUK Y-AXIS (MENAMPILKAN 2 NAMA PRODUK)
// ============================================================================
const CustomYAxisTick = (props: any) => {
  const { x, y, payload, sortBy } = props;
  
  if (!payload || !payload.value) return <g></g>;

  const [rank, predName, actualName] = payload.value.split("||");
  const truncate = (str: string) => str && str.length > 18 ? `${str.substring(0, 18)}...` : str;

  const colorPred = sortBy === 'revenue' ? "#4a90e2" : "#43b78d"; 
  const colorActual = sortBy === 'revenue' ? "#2563eb" : "#059669"; 

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={-8} dy={4} textAnchor="end" fontSize={11}>
        <tspan fill="#9ca3af" fontWeight="bold">#{rank} </tspan>
        <tspan fill={colorPred} fontWeight="semibold"> [P] {truncate(predName)}</tspan>
      </text>
      <text x={0} y={8} dy={4} textAnchor="end" fontSize={11}>
        <tspan fill="#d1d5db" fontWeight="bold">#{rank} </tspan>
        <tspan fill={colorActual} fontWeight="semibold"> [A] {truncate(actualName)}</tspan>
      </text>
    </g>
  );
};

// ============================================================================
// 2. KOMPONEN CUSTOM TOOLTIP
// ============================================================================
const CustomTooltip = ({ active, payload, sortBy }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload; 
    const isRev = sortBy === 'revenue';
    const format = (val: number) => isRev 
      ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)
      : `${val} pcs`;

    return (
      <div className="bg-white p-4 border border-slate-200 shadow-xl rounded-xl min-w-[280px]">
        <p className="font-extrabold text-slate-800 mb-3 border-b border-slate-100 pb-2">Posisi Peringkat #{data.rank}</p>
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full" style={{backgroundColor: payload[0].color}}></div>
              <span className="text-xs font-bold text-slate-500 tracking-wider">PREDIKSI MODEL</span>
            </div>
            <p className="text-sm font-semibold text-slate-800 ml-5">{data.pred_name}</p>
            <p className="text-sm font-bold text-slate-500 ml-5">{format(isRev ? data.pred_revenue : data.pred_qty)}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full" style={{backgroundColor: payload[1].color}}></div>
              <span className="text-xs font-bold text-slate-500 tracking-wider">DATA AKTUAL</span>
            </div>
            <p className="text-sm font-semibold text-slate-800 ml-5">{data.actual_name}</p>
            <p className="text-sm font-bold text-slate-500 ml-5">{format(isRev ? data.actual_revenue : data.actual_qty)}</p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// ============================================================================
// 3. KOMPONEN GRAFIK KOMPARASI PRODUK (PREDIKSI VS AKTUAL)
// ============================================================================
export const ProductComparisonChart = ({ data = [], sortBy, monthLabel }: { data?: any[], sortBy: 'revenue' | 'qty', monthLabel: string }) => {
  
  // Penanganan Error jika data kosong / API belum sinkron
  if (!data || data.length === 0) {
    return (
      <Card className="shadow-neural border-ml-primary/20 mb-8">
        <CardHeader className="text-center pb-4 border-b border-slate-100 mb-4">
          <CardTitle className="text-xl font-bold text-slate-800 flex items-center justify-center gap-2">
            <TrendingUp className="h-5 w-5 text-ml-primary" />
            Breakdown Top 10: Prediksi vs Aktual
          </CardTitle>
          <CardDescription className="text-sm font-semibold text-slate-600 mt-1">
            {monthLabel}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[400px] text-center">
          <PackageOpen className="h-12 w-12 text-slate-300 mb-3" />
          <p className="text-lg font-semibold text-slate-600">Belum Ada Rincian Produk</p>
          <p className="text-sm text-slate-500">Silakan jalankan ulang prediksi / clear cache agar backend menampilkan rincian terbaru.</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    ...item,
    id: `${item.rank}||${item.pred_name}||${item.actual_name}`,
    predLabel: sortBy === 'revenue' ? `Rp${(item.pred_revenue / 1000).toFixed(0)}rb` : `${item.pred_qty}`,
    actualLabel: sortBy === 'revenue' ? `Rp${(item.actual_revenue / 1000).toFixed(0)}rb` : `${item.actual_qty}`
  }));

  const barColorPred = sortBy === 'revenue' ? "#4a90e2" : "#43b78d"; 
  const barColorActual = sortBy === 'revenue' ? "#2563eb" : "#059669"; 

  return (
    <Card className="shadow-neural border-ml-primary/20 mb-8">
      <CardHeader className="text-center pb-4 border-b border-slate-100 mb-4">
        <CardTitle className="text-xl font-bold text-slate-800 flex items-center justify-center gap-2">
          <TrendingUp className="h-5 w-5 text-ml-primary" />
          Breakdown Top 10: Prediksi vs Aktual
        </CardTitle>
        <CardDescription className="text-sm font-semibold text-slate-600 mt-1">
          Berdasarkan {sortBy === 'revenue' ? "Pendapatan (Revenue)" : "Kuantitas (Qty)"} • <span className="text-ml-primary">{monthLabel}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="h-[600px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 20, right: 80, left: 10, bottom: 20 }}
              barGap={4}
              barSize={16}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} opacity={0.3} />
              
              {chartData.length >= 3 && (
                <ReferenceArea y1={chartData[0].id} y2={chartData[2].id} fill="#f0f9ff" opacity={0.6} />
              )}

              <XAxis 
                type="number" 
                tickFormatter={(val) => sortBy === 'revenue' ? `Rp${val / 1000}rb` : val} 
                tick={{ fontSize: 12, fill: '#6b7280' }} 
                axisLine={{ stroke: '#d1d5db' }} 
                tickLine={false} 
              />
              <YAxis 
                type="category" 
                dataKey="id" 
                width={210} 
                tick={(tickProps: any) => <CustomYAxisTick {...tickProps} sortBy={sortBy} />} 
                axisLine={{ stroke: '#d1d5db' }} 
                tickLine={false} 
              />
              
              <Tooltip content={<CustomTooltip sortBy={sortBy} />} />
              <Legend verticalAlign="bottom" height={36} iconType="square" formatter={(value) => <span className="text-slate-600 text-sm font-medium ml-1">{value}</span>} />
              
              <Bar dataKey={sortBy === 'revenue' ? "pred_revenue" : "pred_qty"} fill={barColorPred} name="Prediksi [P]" radius={[0, 4, 4, 0]}>
                <LabelList dataKey="predLabel" position="right" fill={barColorPred} fontSize={12} fontWeight="bold" />
              </Bar>
              
              <Bar dataKey={sortBy === 'revenue' ? "actual_revenue" : "actual_qty"} fill={barColorActual} name="Data Aktual [A]" radius={[0, 4, 4, 0]}>
                <LabelList dataKey="actualLabel" position="right" fill={barColorActual} fontSize={12} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};