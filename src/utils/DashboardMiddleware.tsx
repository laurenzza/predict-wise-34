import { useDataSummary } from "@/store/DataSummaryStore"
import { Navigate, Outlet } from "react-router-dom";

export const DashboardMiddleware = () => {
    const ds = useDataSummary();
    return ds?.total_transaksi != null && ds.total_transaksi > 0 ? <Outlet/> : <Navigate to={"/account-settings?tab=data"}/>
}