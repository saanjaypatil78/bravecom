"use client";

import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";

export default function AuthModalWrapper() {
    const { isAuthModalOpen, closeAuthModal, login } = useAuth();

    return (
        <AuthModal
            isOpen={isAuthModalOpen}
            onClose={closeAuthModal}
            onLoginSuccess={(userName: string, userType: "buyer" | "investor") => login(userName, userType === "buyer" ? "BUYER" : "INVESTOR")}
        />
    );
}
