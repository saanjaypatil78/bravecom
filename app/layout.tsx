import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import AuthWrapper from "./components/AuthWrapper";
import CartModal from "./components/CartModal";
import AuthModalWrapper from "./components/AuthModalWrapper";
import DebuggerPanel from "./components/DebuggerPanel";
import AntigravityStatus from "./components/AntigravityStatus";
import CinematicLayout from "./components/CinematicLayout";

export const metadata: Metadata = {
  title: "BRAVECOM - IPO Fundraising & Dropshipping Platform",
  description: "BRAVECOM IPO Platform with 15% Static ROI, Dropshipping, and PMS Services. Join the next-generation investment ecosystem.",
  keywords: ["IPO", "Dropshipping", "PMS", "Investment", "Franchise", "Affiliate Marketing"],
  authors: [{ name: "Brave Ecom Pvt Ltd" }],
  openGraph: {
    title: "BRAVECOM - IPO Fundraising & Dropshipping",
    description: "The next-generation IPO Fundraising & Ecosystem Platform",
    type: "website",
    locale: "en_IN",
    siteName: "BRAVECOM",
  },
  twitter: {
    card: "summary_large_image",
    title: "BRAVECOM - IPO Fundraising & Dropshipping",
    description: "The next-generation IPO Fundraising & Ecosystem Platform",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        {/* JSON-LD Structured Data — Organization */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Brave Ecom Pvt Ltd",
            "alternateName": "BRAVECOM",
            "description": "Next-generation IPO fundraising, dropshipping, PMS services, and investment ecosystem platform with AI-powered automation.",
            "url": "https://bravecom.in",
            "foundingDate": "2024",
            "sameAs": [],
            "contactPoint": {
              "@type": "ContactPoint",
              "email": "info@braveecom.com",
              "contactType": "customer service"
            }
          })
        }} />
      </head>
      <body className="bg-[#050B14] text-white font-[Outfit,sans-serif] antialiased min-h-screen flex flex-col overflow-x-hidden selection:bg-[#1173d4] selection:text-white">
        <AuthWrapper>
          <AuthProvider>
            <CartProvider>
              <main className="flex-1">
                <CinematicLayout>
                  {children}
                </CinematicLayout>
              </main>

              {/* Cart Modal */}
              <CartModal />

              {/* Auth Modal */}
              <AuthModalWrapper />

              {/* Debugger Panel - Disabled for debugging */}
              {/* <DebuggerPanel model="gemini-2.0-pro" enabled={true} /> */}

              {/* Global Footer */}
              <footer className="w-full bg-black border-t border-white/5 py-12 px-6 relative z-50">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                  <div className="space-y-4 max-w-2xl">
                    <h4 className="font-black tracking-widest text-xl bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">BRAVECOM</h4>
                    <p className="text-xs text-slate-500 font-mono">
                      COPYRIGHT 2026 Brave Ecom Pvt Ltd. All Rights Reserved.<br />
                      Sunray Systems - Frictionless Dropshipping Innovation.
                    </p>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 mt-4">
                      <p className="text-[10px] text-slate-400 leading-relaxed uppercase tracking-widest">
                        <strong className="text-white">Transparency & Margin Priority:</strong> In the BRAVECOM ecosystem, &quot;Trading&quot; encompasses both live stock market trading and physical product trading. We strictly maintain our core margin benefits across all ecosystems while dynamically deciding product prices to perpetually sustain the network yield.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-8 text-sm font-medium text-slate-400">
                    <div className="space-y-2 flex flex-col">
                      <strong className="text-white">Ecosystem</strong>
                      <a href="/mall" className="hover:text-blue-400 transition-colors">Dropship Mall</a>
                      <a href="/mall/spotlight" className="hover:text-red-400 transition-colors">Sovereign Spotlight</a>
                      <a href="/mall/luxury" className="hover:text-yellow-400 transition-colors">Luxury Tier</a>
                      <a href="/vendor" className="hover:text-fuchsia-400 transition-colors">Vendor Portal</a>
                      <a href="/dashboard" className="hover:text-amber-400 transition-colors">Dashboard</a>
                    </div>
                    <div className="space-y-2 flex flex-col">
                      <strong className="text-white">Company</strong>
                      <a href="/about" className="hover:text-white transition-colors">About Us</a>
                      <a href="/contact" className="hover:text-white transition-colors">Contact</a>
                      <a href="/ledger" className="hover:text-[#25f4f4] transition-colors">Public Ledger</a>
                      <a href="/network" className="hover:text-blue-400 transition-colors">Network</a>
                    </div>
                    <div className="space-y-2 flex flex-col">
                      <strong className="text-white">Legal</strong>
                      <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
                      <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                  </div>

                  <div className="mt-6 md:mt-0">
                    <AntigravityStatus />
                  </div>
                </div>
              </footer>
            </CartProvider>
          </AuthProvider>
        </AuthWrapper>
      </body>
    </html>
  );
}
