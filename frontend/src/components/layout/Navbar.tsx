import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    useAuth
} from "../../context/AuthContext";

import {
    Button
} from "@/components/ui/button";

import {
    Avatar,
    AvatarFallback
} from "@/components/ui/avatar";

const Navbar = () => {

    const navigate =
        useNavigate();

    const location =
        useLocation();

    const {
        token,
        role,
        logout
    } = useAuth();

    const handleLogout = () => {

        logout();

        navigate(
            "/login"
        );
    };

    const navItem = (
        label: string,
        path: string
    ) => (

        <Link
            to={path}
            className={
                location.pathname === path
                    ? "font-semibold text-black"
                    : "text-muted-foreground hover:text-black transition"
            }
        >
            {label}
        </Link>
    );

    return (

        <nav className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">

            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() =>

                        navigate(

                            role === "ADMIN"

                                ? "/admin"

                                : "/dashboard"
                        )

                    }
                >

                    <div className="h-9 w-9 rounded-xl bg-black text-white flex items-center justify-center font-bold">
                        S
                    </div>

                    <div>

                        <h1 className="font-bold text-lg">
                            Spark Events
                        </h1>

                        <p className="text-xs text-muted-foreground">
                            AWS Powered Booking Platform
                        </p>

                    </div>

                </div>

                {token ? (

                    <div className="flex items-center gap-8">

                        {role !== "ADMIN" &&

                            navItem(
                                "Dashboard",
                                "/dashboard"
                            )
                        }

                        {navItem(
                            "Events",
                            "/events"
                        )}

                        {navItem(
                            "Bookings",
                            "/bookings"
                        )}

                        {role === "ADMIN" &&

                            navItem(
                                "Admin",
                                "/admin"
                            )
                        }

                    </div>

                ) : (

                    <div className="flex gap-3">

                        <Button
                            variant="ghost"
                            onClick={() =>
                                navigate("/login")
                            }
                        >
                            Login
                        </Button>

                        <Button
                            onClick={() =>
                                navigate("/register")
                            }
                        >
                            Register
                        </Button>

                    </div>

                )}

                {token && (

                    <div className="flex items-center gap-3">

                        <Avatar>

                            <AvatarFallback>
                                SJ
                            </AvatarFallback>

                        </Avatar>

                        <Button
                            variant="outline"
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>

                    </div>

                )}

            </div>

        </nav>
    );
};

export default Navbar;