import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SalesData {
    sale_id: number;
    tanggal_pembayaran: Date;
    status_terakhir: string;
    nama_produk: string;
    jumlah_produk_dibeli: number;
    harga_jual_idr: number;
    total_penjualan_idr: number;
}

interface SalesDataStore {
    dataset: SalesData[];
}

const useSalesDataStore = create<SalesDataStore>()(
    persist(
        (set, get) => ({
            dataset: [
                {
                    sale_id: 0,
                    tanggal_pembayaran: new Date("2000-01-01T00:00:00.000Z"),
                    status_terakhir: "",
                    nama_produk: "",
                    jumlah_produk_dibeli: -1,
                    harga_jual_idr: -1,
                    total_penjualan_idr: -1,
                },
            ]
        }),
        {
            name: "dataset"
        }
    )
);

export const useSalesDataset = useSalesDataStore((state) => state.dataset);