import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    LogOut,
    Menu,
    Search,
    Ticket,
    Shield,
    X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { token, role, email, logout } = useAuth();
    const [query, setQuery] = useState(() => {
        return new URLSearchParams(window.location.search).get("q") ?? "";
    });
    const [mobileOpen, setMobileOpen] = useState(false);

    if (location.pathname === "/login" || location.pathname === "/register") {
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const submitSearch = (event?: React.FormEvent) => {
        event?.preventDefault();
        const next = query.trim();
        navigate(next ? `/events?q=${encodeURIComponent(next)}` : "/events");
        setMobileOpen(false);
    };

    const isActive = (path: string) => {
        if (path === "/events") {
            return location.pathname === "/" || location.pathname === "/events";
        }
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
    };

    const navLinks = [
        { label: "Explore Events", path: "/events" },
        ...(token ? [{ label: "My Bookings", path: "/bookings" }] : []),
        ...(role === "ADMIN" ? [{ label: "Admin Dashboard", path: "/admin", isAdmin: true }] : []),
    ];

    const userInitial = email
        ? email.charAt(0).toUpperCase()
        : role === "ADMIN"
          ? "A"
          : "U";

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/[0.07] bg-[#0b0d10]/85 backdrop-blur-md transition-colors">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                {/* Brand & Left Navigation */}
                <div className="flex items-center gap-6">
                    <Link
                        to="/events"
                        className="group flex items-center transition-opacity hover:opacity-90"
                    >
                        <Logo />
                    </Link>

                    <nav className="hidden items-center gap-1 md:flex">
                        {navLinks.map((link) => {
                            const active = isActive(link.path);
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={cn(
                                        "relative rounded-md px-3 py-1.5 text-xs font-medium tracking-wide transition-all",
                                        active
                                            ? "bg-white/[0.08] text-foreground shadow-sm"
                                            : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
                                        link.isAdmin && "text-accent-foreground"
                                    )}
                                >
                                    {link.label}
                                    {link.isAdmin && (
                                        <span className="ml-1.5 inline-block size-1.5 rounded-full bg-primary" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Center / Right Quick Search */}
                <form
                    onSubmit={submitSearch}
                    className="hidden max-w-xs flex-1 sm:block md:max-w-sm"
                >
                    <div className="relative">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search events, venues..."
                            className="h-8 border-white/[0.08] bg-[#12151b]/80 pr-8 pl-8 text-xs text-foreground placeholder:text-muted-foreground/60 focus-visible:border-primary/50 focus-visible:bg-[#151922]"
                        />
                        {query && (
                            <button
                                type="button"
                                onClick={() => {
                                    setQuery("");
                                    if (location.pathname === "/events") {
                                        navigate("/events");
                                    }
                                }}
                                className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="size-3" />
                            </button>
                        )}
                    </div>
                </form>

                {/* Right Actions & Account */}
                <div className="flex items-center gap-2">
                    {!token ? (
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-muted-foreground hover:text-foreground"
                                onClick={() => navigate("/login")}
                            >
                                Login
                            </Button>
                            <Button
                                size="sm"
                                className="h-8 text-xs shadow-[0_2px_10px_rgb(124_108_255_/_0.25)]"
                                onClick={() => navigate("/register")}
                            >
                                Register
                            </Button>
                        </div>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className="group flex items-center gap-2 rounded-full p-0.5 outline-none ring-offset-background transition-transform focus-visible:ring-2 focus-visible:ring-primary"
                                    aria-label="User menu"
                                >
                                    <Avatar size="sm" className="size-8 border border-white/10 transition-colors group-hover:border-primary/40">
                                        <AvatarFallback className="bg-gradient-to-br from-[#1d2030] to-[#12151b] text-xs font-semibold text-accent-foreground">
                                            {userInitial}
                                        </AvatarFallback>
                                    </Avatar>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 border-white/10 bg-[#12151b]">
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-xs font-medium text-foreground">
                                            {email ?? "Signed in"}
                                        </p>
                                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                            <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
                                            {role === "ADMIN" ? "Administrator" : "Event Goer"}
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuItem
                                    onClick={() => navigate("/dashboard")}
                                    className="cursor-pointer text-xs"
                                >
                                    <LayoutDashboard className="mr-2 size-3.5 text-muted-foreground" />
                                    Dashboard
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => navigate("/bookings")}
                                    className="cursor-pointer text-xs"
                                >
                                    <Ticket className="mr-2 size-3.5 text-muted-foreground" />
                                    My Bookings
                                </DropdownMenuItem>
                                {role === "ADMIN" && (
                                    <DropdownMenuItem
                                        onClick={() => navigate("/admin")}
                                        className="cursor-pointer text-xs text-accent-foreground font-medium"
                                    >
                                        <Shield className="mr-2 size-3.5 text-primary" />
                                        Admin Dashboard
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuItem
                                    variant="destructive"
                                    onClick={handleLogout}
                                    className="cursor-pointer text-xs text-rose-400 focus:text-rose-400"
                                >
                                    <LogOut className="mr-2 size-3.5" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {/* Mobile Menu Trigger */}
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 text-muted-foreground hover:text-foreground md:hidden"
                                aria-label="Open menu"
                            >
                                <Menu className="size-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="w-[280px] border-l border-white/10 bg-[#0b0d10] p-5"
                        >
                            <SheetHeader className="mb-6 text-left">
                                <SheetTitle>
                                    <Logo />
                                </SheetTitle>
                            </SheetHeader>

                            <div className="flex flex-col gap-6">
                                <form onSubmit={submitSearch}>
                                    <div className="relative">
                                        <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            placeholder="Search events..."
                                            className="h-9 border-white/10 bg-[#12151b] pl-8 text-xs"
                                        />
                                    </div>
                                </form>

                                <nav className="flex flex-col gap-1">
                                    {navLinks.map((link) => {
                                        const active = isActive(link.path);
                                        return (
                                            <Link
                                                key={link.path}
                                                to={link.path}
                                                onClick={() => setMobileOpen(false)}
                                                className={cn(
                                                    "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                                    active
                                                        ? "bg-white/[0.08] text-foreground"
                                                        : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                                                )}
                                            >
                                                {link.label}
                                                {link.isAdmin && (
                                                    <span className="text-[10px] tracking-wider text-primary uppercase">
                                                        Admin
                                                    </span>
                                                )}
                                            </Link>
                                        );
                                    })}
                                </nav>

                                <div className="mt-auto border-t border-white/10 pt-4">
                                    {token ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2.5">
                                                <Avatar size="sm" className="size-8 border border-white/10">
                                                    <AvatarFallback className="bg-[#1d2030] text-xs font-medium text-accent-foreground">
                                                        {userInitial}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="truncate text-xs">
                                                    <p className="truncate font-medium text-foreground">
                                                        {email ?? "Account"}
                                                    </p>
                                                    <p className="text-muted-foreground capitalize">
                                                        {role?.toLowerCase()}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full text-xs text-rose-400"
                                                onClick={handleLogout}
                                            >
                                                <LogOut className="mr-2 size-3.5" />
                                                Logout
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setMobileOpen(false);
                                                    navigate("/login");
                                                }}
                                            >
                                                Login
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => {
                                                    setMobileOpen(false);
                                                    navigate("/register");
                                                }}
                                            >
                                                Register
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
