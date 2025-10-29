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
import { Product, useProducts } from "@/hooks/useProducts";

export const ProductTable = () => {
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  const ds = useDataSummary();
  
  const totalPages = Math.ceil(ds.total_produk/limit);
  const { data: products, isLoading, isError } = useProducts(limit, offset);

  const format_date_my = useFormatDate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setOffset((page-1) * limit);
  }

  const handleLimitChange = (value: string) => {
    setCurrentPage(1);
    setLimit(Number(value));
    setOffset(0);
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
      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableCaption className="mb-5">Data penjualan dari periode {format_date_my(ds.periode_awal)} - {format_date_my(ds.periode_akhir)}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="max-w-[75px]">Nomor Produk</TableHead>
              <TableHead className="min-w-[250px]">Nama Produk</TableHead>
              <TableHead className="text-right">Transaksi</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              isLoading ? (
                empty_rows.map((item) => (
                  item
                ))
              ) : products.length > 0 ? (
                products.map((item: Product) => (
                  <TableRow key={item.nomor_produk} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-xs">{item.nomor_produk}</TableCell>
                    <TableCell className="text-sm max-w-[250px]">
                      {item.nama_produk}
                    </TableCell>
                    <TableCell className="text-right">{item.total_transaksi.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(item.total_penjualan)}</TableCell>
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