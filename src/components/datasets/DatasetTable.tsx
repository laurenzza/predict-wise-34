import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

const sampleData = [
  {
    invoice: "INV/20200507/XX/V/537956873",
    tanggal: "5/8/20 10:19",
    status: "Pesanan Selesai",
    produk: "AS DINAMO KIPAS ANGIN MODEL COSMOS,MIYAKO,UMUM-RRT.",
    jumlah: 10,
    harga: 7000,
    total: 70000
  },
  {
    invoice: "INV/20200508/XX/V/538745415",
    tanggal: "5/8/20 18:00",
    status: "Pesanan Selesai",
    produk: "AS DINAMO KIPAS ANGIN MODEL COSMOS,MIYAKO,UMUM-RRT.",
    jumlah: 30,
    harga: 7000,
    total: 210000
  },
  {
    invoice: "INV/20240419/MPL/3862112744",
    tanggal: "4/19/24 18:33",
    status: "Dibatalkan Penjual",
    produk: "KAPASITOR 1.5UF 1,5UF 1.5 UF 1,5 UF 450V MIKRO CAPASITOR KIPAS ANGIN",
    jumlah: 20,
    harga: 3200,
    total: 64000
  },
  {
    invoice: "INV/20240419/MPL/3862131054",
    tanggal: "4/19/24 18:47",
    status: "Dibatalkan Penjual",
    produk: "KAPASITOR 1.2UF 1,2UF 1.2 UF 1,2 UF 450V MIKRO CAPASITOR KIPAS ANGIN",
    jumlah: 20,
    harga: 3000,
    total: 60000
  },
  {
    invoice: "INV/20240419/MPL/3862135316",
    tanggal: "4/19/24 18:51",
    status: "Dibatalkan Penjual",
    produk: "kapasitor kipas angin 2 uf mickro 450V capasitor kotak spareparts",
    jumlah: 20,
    harga: 4100,
    total: 168000
  }
];

export const DatasetTable = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");

  const getStatusBadge = (status: string) => {
    if (status === "Pesanan Selesai") {
      return <Badge className="bg-success/10 text-success border-success/20">Selesai</Badge>;
    }
    if (status.includes("Dibatalkan")) {
      return <Badge variant="destructive">Dibatalkan</Badge>;
    }
    return <Badge variant="secondary">{status}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Filter data based on selected filters
  const filteredData = sampleData.filter(item => {
    const statusMatch = statusFilter === "all" || item.status === statusFilter;
    const yearMatch = yearFilter === "all" || item.tanggal.includes(`/${yearFilter.slice(-2)}`);
    return statusMatch && yearMatch;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="w-[200px]">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="Pesanan Selesai">Pesanan Selesai</SelectItem>
              <SelectItem value="Dibatalkan Penjual">Dibatalkan Penjual</SelectItem>
              <SelectItem value="Dibatalkan Pembeli">Dibatalkan Pembeli</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-[200px]">
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter Tahun" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tahun</SelectItem>
              <SelectItem value="2020">2020</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table with ScrollArea */}
      <div className="rounded-md border">
        <ScrollArea className="h-[500px]">
          <Table>
            <TableCaption>Data penjualan dari periode Mei 2020 - April 2024</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Invoice</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="min-w-[250px]">Nama Produk</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead className="text-right">Harga</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow key={index} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-xs">{item.invoice}</TableCell>
                  <TableCell className="text-sm">{item.tanggal}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-sm max-w-[250px] truncate" title={item.produk}>
                    {item.produk}
                  </TableCell>
                  <TableCell className="text-right">{item.jumlah}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.harga)}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(item.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
};