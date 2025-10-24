import { useAuthIsAuthenticated } from "@/store/AuthStore";
import { Outlet, Navigate } from "react-router-dom";

export const ProtectedRoutes = () => {
    const isAuthenticated = useAuthIsAuthenticated();
    return isAuthenticated() ? <Outlet/> : <Navigate to={"/login"}/>
}

export const UnprotectedRoutes = () => {
    const isAuthenticated = useAuthIsAuthenticated();
    return isAuthenticated() ? <Navigate to={"/"}/> : <Outlet/>
}