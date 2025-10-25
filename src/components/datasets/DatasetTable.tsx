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
import { EventHandler, useEffect, useState } from "react";
import { useSalesDataset } from "@/hooks/useSalesDataset";
import { useDataSummary, useFormatDate } from "@/store/DataSummaryStore";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useCurrentPage, useLimit, useOffset, useRowsCount, useSetCurrentPage, useSetLimit } from "@/store/PaginationStore";

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

  const currentPage = useCurrentPage();
  const limit = useLimit();
  const offset = useOffset();
  const setLimit = useSetLimit();
  const setCurrentPage = useSetCurrentPage();
  const total_transaksi = useRowsCount();
  
  const totalPages = Math.ceil(total_transaksi/limit);
  const { data: sales, isLoading, isError } = useSalesDataset(limit, offset, yearFilter, statusFilter);

  const format_date_my = useFormatDate();
  const ds = useDataSummary();

  const getStatusBadge = (status: string) => {
    if (status === "Pesanan Selesai") {
      return <Badge className="bg-success/10 text-success border-success/20">Selesai</Badge>;
    }
    if (status === "Dibatalkan Penjual" || status === "Dibatalkan Pembeli" || status === "Dibatalkan Sistem") {
      return <Badge variant="destructive">{status}</Badge>;
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

  const formatDate = (date: string) => {
    const new_date = new Date(date);
    return new_date.toLocaleString('id-ID', { day: "numeric", month: "numeric", year: "numeric" });
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  }

  const handleLimitChange = (value: string) => {
    setCurrentPage(1);
    setLimit(Number(value));
  }

  let year_start = Number((new Date(ds.periode_awal)).toLocaleString('id-ID', {year: "numeric"}));
  let year_end = Number((new Date(ds.periode_akhir)).toLocaleString('id-ID', {year: "numeric"}));
  let years = [];
  for (let i = year_start; i <= year_end; i++) {
    years.push(i);
  }
  
  let empty_rows = [];
  for (let i = 0; i < limit; i++) {
    empty_rows.push(
      <TableRow key={i} className="hover:bg-muted/50 h-[75px]">
        <TableCell className="font-mono text-xs"></TableCell>
        <TableCell className="text-sm"></TableCell>
        <TableCell></TableCell>
        <TableCell className="text-sm max-w-[250px]"></TableCell>
        <TableCell className="text-right"></TableCell>
        <TableCell className="text-right"></TableCell>
        <TableCell className="text-right font-medium"></TableCell>
      </TableRow>
    );
  }

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
              <SelectItem value="Dibatalkan Sistem">Dibatalkan Sistem</SelectItem>
              <SelectItem value="Sedang Dikirim">Sedang Dikirim</SelectItem>
              <SelectItem value="others">Lainnya</SelectItem>
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
              {
                years.map((item, index) => (
                  <SelectItem key={index} value={item}>{item}</SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableCaption className="mb-5">Data penjualan dari periode {format_date_my(ds.periode_awal)} - {format_date_my(ds.periode_akhir)}</TableCaption>
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
            {
              isLoading ? (
                empty_rows.map((item) => (
                  item
                ))
              ) : sales.dataset.length > 0 ? (
                sales.dataset.map((item: any) => (
                  <TableRow key={item.sale_id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-xs">{item.invoice}</TableCell>
                    <TableCell className="text-sm">{formatDate(item.tanggal_pembayaran)}</TableCell>
                    <TableCell>{getStatusBadge(item.status_terakhir)}</TableCell>
                    <TableCell className="text-sm max-w-[250px]">
                      {item.nama_produk}
                    </TableCell>
                    <TableCell className="text-right">{item.jumlah_produk_dibeli}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.harga_jual_idr)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(item.total_penjualan_idr)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Tidak ada data
                  </TableCell>
                </TableRow>
              )
            }
            {
              isError && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Terjadi kesalahan
                  </TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Baris per halaman:</span>
          <Select value={limit.toString()} onValueChange={handleLimitChange}>
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Halaman {currentPage} dari {totalPages}
          </span>
          
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>

            {/* Page numbers */}
            <div className="flex gap-1">
              {(() => {
                const pages = [];
                const maxVisible = 5;
                let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                let endPage = Math.min(totalPages, startPage + maxVisible - 1);
                
                if (endPage - startPage < maxVisible - 1) {
                  startPage = Math.max(1, endPage - maxVisible + 1);
                }
                
                if (startPage > 1) {
                  pages.push(
                    <button
                      key={1}
                      onClick={() => handlePageChange(1)}
                      className="px-3 py-1 border rounded hover:bg-gray-100 text-sm"
                    >
                      1
                    </button>
                  );
                  if (startPage > 2) {
                    pages.push(<span key="dots1" className="px-2 py-1 text-gray-500">...</span>);
                  }
                }
                
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => handlePageChange(i)}
                      className={`px-3 py-1 border rounded text-sm ${
                        currentPage === i
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {i}
                    </button>
                  );
                }
                
                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    pages.push(<span key="dots2" className="px-2 py-1 text-gray-500">...</span>);
                  }
                  pages.push(
                    <button
                      key={totalPages}
                      onClick={() => handlePageChange(totalPages)}
                      className="px-3 py-1 border rounded hover:bg-gray-100 text-sm"
                    >
                      {totalPages}
                    </button>
                  );
                }
                
                return pages;
              })()}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};