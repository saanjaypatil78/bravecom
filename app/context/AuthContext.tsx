"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession, signIn, signOut as nextAuthSignOut } from "next-auth/react";

// ─── Role Types ─────────────────────────────────────────────────────────────
export type UserRole = "ADMIN" | "INVESTOR" | "FRANCHISE_PARTNER" | "BUYER" | "VENDOR" | "QA_ANALYST";

export interface User {
    name: string | null;
    email: string | null;
    image: string | null;
    role: UserRole;
    userType: "buyer" | "investor"; // legacy compat
}

export interface AuthContextType {
    user: User | null;
    login: (name: string, role: UserRole, email?: string) => void;
    logout: () => void;
    isAuthModalOpen: boolean;
    openAuthModal: () => void;
    closeAuthModal: () => void;
    signIn: () => void;
    isLoading: boolean;
    setRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Role → Dashboard Mapping ───────────────────────────────────────────────
export const ROLE_DASHBOARDS: Record<UserRole, string> = {
    ADMIN: "/admin/ecosystem-monitor",
    INVESTOR: "/dashboard",
    FRANCHISE_PARTNER: "/franchise",
    BUYER: "/mall",
    VENDOR: "/vendor",
    QA_ANALYST: "/admin/audit-logs",
};

export const ROLE_META: Record<UserRole, { label: string; icon: string; color: string; description: string }> = {
    ADMIN: { label: "Administrator", icon: "🛡️", color: "#ef4444", description: "Full system access — treasury, commissions, franchise management, audit logs" },
    INVESTOR: { label: "Investor", icon: "📈", color: "#25f4f4", description: "Investment portfolio, profit tracking, ROI dashboard, disbursement requests" },
    FRANCHISE_PARTNER: { label: "Franchise Partner", icon: "🏢", color: "#f59e0b", description: "Territory management, royalty tracking, team performance, onboarding pipeline" },
    BUYER: { label: "Buyer", icon: "🛒", color: "#f425af", description: "Dropship mall, product catalog, orders, wishlist, cart & checkout" },
    VENDOR: { label: "Vendor", icon: "📦", color: "#8b5cf6", description: "Product listings, analytics dashboard, settlement tracking, inventory" },
    QA_ANALYST: { label: "QA Analyst", icon: "🔍", color: "#22c55e", description: "System health monitoring, audit logs, error tracking, performance metrics" },
};

// ─── Legacy role mapping ────────────────────────────────────────────────────
function roleToLegacy(role: UserRole): "buyer" | "investor" {
    if (role === "BUYER" || role === "VENDOR") return "buyer";
    return "investor";
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [currentRole, setCurrentRole] = useState<UserRole>("BUYER");

    // Load saved role from localStorage
    useEffect(() => {
        const saved = typeof window !== "undefined" ? localStorage.getItem("bravecom_role") : null;
        if (saved && Object.keys(ROLE_DASHBOARDS).includes(saved)) {
            setCurrentRole(saved as UserRole);
        }
    }, []);

    const user = session?.user ? {
        name: session.user.name || null,
        email: session.user.email || null,
        image: session.user.image || null,
        role: currentRole,
        userType: roleToLegacy(currentRole),
    } : null;

    const login = (name: string, role: UserRole, email?: string) => {
        setCurrentRole(role);
        if (typeof window !== "undefined") {
            localStorage.setItem("bravecom_role", role);
        }
    };

    const setRole = (role: UserRole) => {
        setCurrentRole(role);
        if (typeof window !== "undefined") {
            localStorage.setItem("bravecom_role", role);
        }
    };

    const logout = async () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("bravecom_role");
        }
        await nextAuthSignOut({ redirect: false });
        window.location.href = "/";
    };

    const openAuthModal = () => setIsAuthModalOpen(true);
    const closeAuthModal = () => setIsAuthModalOpen(false);

    const handleSignIn = () => {
        signIn("google", { callbackUrl: ROLE_DASHBOARDS[currentRole] });
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            isAuthModalOpen,
            openAuthModal,
            closeAuthModal,
            signIn: handleSignIn,
            isLoading: status === "loading",
            setRole,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
