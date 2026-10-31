import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const { token, role } = useAuth();
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (role !== "ADMIN") {
        return <Navigate to="/events" replace />;
    }

    return <>{children}</>;
};

export default AdminRoute;
