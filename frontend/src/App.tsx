import { useLocation } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/layout/Navbar";
import { SiteFooter } from "./components/layout/SiteFooter";
import { ToastProvider } from "@/components/ui/toast";

function App() {
    const location = useLocation();
    const isAuth = location.pathname === "/login" || location.pathname === "/register";

    return (
        <ToastProvider>
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <div className="flex-1">
                    <AppRoutes />
                </div>
                {!isAuth && <SiteFooter />}
            </div>
        </ToastProvider>
    );
}

export default App;
