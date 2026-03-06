"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useAuth } from "@/app/context/AuthContext";
import { useCart } from "@/app/context/CartContext";

interface MallHeaderActionsProps {
    theme?: "teal" | "fuchsia";
}

export default function MallHeaderActions({ theme = "teal" }: MallHeaderActionsProps) {
    const { data: session, status } = useSession();
    const { openAuthModal } = useAuth();
    const { totalItems, setIsCartOpen } = useCart();

    // Theme Classes
    const accentBtnClass = theme === "teal"
        ? "bg-[#25f4f4] hover:bg-[#25f4f4]/90 text-[#102222]"
        : "bg-[#f425af] hover:bg-[#f425af]/90 text-white";
    const darkBgClass = theme === "teal" ? "dark:bg-[#162a2a]" : "dark:bg-[#2d1625]";
    const borderClass = theme === "teal" ? "dark:border-[#283939]" : "dark:border-[#3d1e32]";
    const hoverClass = theme === "teal" ? "dark:hover:bg-[#283939]" : "dark:hover:bg-[#3d1e32]";
    const outlineIconClass = "material-symbols-outlined";
    const ringClass = theme === "teal" ? "ring-[#25f4f4]/20" : "ring-[#f425af]/20";
    const badgeBgClass = theme === "teal" ? "bg-[#25f4f4] text-[#102222]" : "bg-[#f425af] text-white";

    // Fallback UI while loading
    if (status === "loading") {
        return (
            <div className={`flex items-center gap-3 border-l border-slate-200 ${borderClass} pl-6`}>
                <div className={`w-32 h-10 bg-slate-200 ${darkBgClass} rounded-lg animate-pulse`}></div>
            </div>
        );
    }

    if (session?.user) {
        return (
            <div className={`flex items-center gap-3 border-l border-slate-200 ${borderClass} pl-6`}>
                {/* Sign Out Button */}
                <button
                    onClick={() => signOut({ callbackUrl: '/mall' })}
                    title="Sign Out"
                    className={`flex items-center justify-center rounded-lg size-10 bg-white ${darkBgClass} text-slate-900 dark:text-white hover:bg-slate-100 ${hoverClass} transition-colors border border-slate-200 ${borderClass}`}
                >
                    <span className={outlineIconClass}>logout</span>
                </button>

                {/* Notifications */}
                <button className={`flex items-center justify-center rounded-lg size-10 bg-white ${darkBgClass} text-slate-900 dark:text-white hover:bg-slate-100 ${hoverClass} transition-colors border border-slate-200 ${borderClass}`}>
                    <span className={outlineIconClass}>notifications</span>
                </button>

                {/* Shopping Cart */}
                <button
                    onClick={() => setIsCartOpen(true)}
                    className={`flex items-center justify-center rounded-lg size-10 bg-white ${darkBgClass} text-slate-900 dark:text-white hover:bg-slate-100 ${hoverClass} transition-colors border border-slate-200 ${borderClass} relative`}
                >
                    <span className={outlineIconClass}>shopping_cart</span>
                    {totalItems > 0 && (
                        <span className={`absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${badgeBgClass}`}>
                            {totalItems}
                        </span>
                    )}
                </button>

                {/* User Avatar */}
                <div className={`size-10 rounded-full bg-slate-200 ${darkBgClass} overflow-hidden border border-slate-200 ${borderClass} ring-2 ${ringClass}`}>
                    <img
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                        src={session.user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-3 border-l border-slate-200 ${borderClass} pl-6`}>
            {/* Connect Wallet / Login */}
            <button
                onClick={openAuthModal}
                className={`${accentBtnClass} px-4 py-2 rounded-lg text-sm font-bold transition-colors`}
            >
                Connect Wallet
            </button>

            {/* Shopping Cart */}
            <button
                onClick={() => setIsCartOpen(true)}
                className={`p-2 rounded-lg hover:bg-slate-100 ${hoverClass} transition-colors text-slate-900 dark:text-white relative`}
            >
                <span className={outlineIconClass}>shopping_cart</span>
                {totalItems > 0 && (
                    <span className={`absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${badgeBgClass}`}>
                        {totalItems}
                    </span>
                )}
            </button>
        </div>
    );
}
