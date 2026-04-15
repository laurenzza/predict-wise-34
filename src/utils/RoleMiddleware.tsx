import Unauthorized from "@/pages/Unauthorized";
import { useAuthIsAuthenticated, useAuthRole } from "@/store/AuthStore";
import { Navigate, Outlet } from "react-router-dom";

export const OwnerOnly = () => {
    const role = useAuthRole();
    return role == "OWNER" ? <Outlet/> : <Unauthorized/>
    // return role == "OWNER" ? <Outlet/> : <Navigate to={"/not-found"}/>
}

export const EmployeeOnly = () => {
    const role = useAuthRole();
    return role == "EMPLOYEE" ? <Outlet/> : <Unauthorized/>
    // return role == "EMPLOYEE" ? <Outlet/> : <Navigate to={"/not-found"}/>
}