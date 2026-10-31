import {
    createContext,
    useContext,
    useState,
    useMemo
} from "react";

interface AuthContextType {
    token: string | null;
    role: string | null;
    email: string | null;
    login: (token: string, role: string) => void;
    logout: () => void;
}

function getEmailFromToken(token: string | null): string | null {
    if (!token) return null;
    try {
        const parts = token.split(".");
        if (parts.length >= 2) {
            const base64Url = parts[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
            );
            const payload = JSON.parse(jsonPayload);
            return payload.sub || null;
        }
    } catch {
        return null;
    }
    return null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(
        () => localStorage.getItem("token")
    );
    const [role, setRole] = useState<string | null>(
        () => localStorage.getItem("role")
    );

    const email = useMemo(() => getEmailFromToken(token), [token]);

    const login = (newToken: string, newRole: string) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("role", newRole);
        setToken(newToken);
        setRole(newRole);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("selectedSeat");
        localStorage.removeItem("selectedEvent");
        setToken(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                role,
                email,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("AuthContext missing");
    }
    return context;
};
