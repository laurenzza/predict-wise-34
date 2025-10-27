import { useAuthIsAuthenticated, useAuthRole } from "@/store/AuthStore";
import { Navigate, Outlet } from "react-router-dom";

export const AdminOnly = () => {
    const role = useAuthRole();
    return role == "ADMIN" ? <Outlet/> : <Navigate to={"/not-found"}/>
}

export const DeveloperOnly = () => {
    const role = useAuthRole();
    return role == "DEVELOPER" ? <Outlet/> : <Navigate to={"/not-found"}/>
}