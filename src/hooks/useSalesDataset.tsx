import { apiFetchSales } from "@/api";
import { useQuery } from "@tanstack/react-query"

export const useSalesDataset = (limit: number, offset: number, year: string, status: string) => {
    return useQuery({
        queryKey: ["sales_dataset", limit, offset, year, status],
        queryFn: () => apiFetchSales(limit, offset, year, status),
    });
}