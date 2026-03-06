import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050B14] text-white">
      <nav className="w-full p-6 flex justify-between items-center bg-black/50 backdrop-blur-md border-b border-white/5">
        <Link href="/" className="font-black tracking-widest text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
          BRAVECOM
        </Link>
        <Link href="/" className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-sm font-bold transition-all flex items-center gap-2">
          Back to Home <ArrowRight size={14} />
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-5xl md:text-6xl font-black mb-8">About BRAVECOM</h1>
        
        <div className="space-y-8 text-lg text-slate-300">
          <p>
            BRAVECOM is a next-generation investment ecosystem combining IPO fundraising, 
            dropshipping, and portfolio management services. Our mission is to democratize 
            wealth creation through innovative financial products.
          </p>
          
          <h2 className="text-2xl font-bold text-white mt-12">Our Vision</h2>
          <p>
            To create a frictionless financial ecosystem where investors and entrepreneurs 
            can seamlessly connect, trade, and grow together through cutting-edge technology.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12">Our Mission</h2>
          <p>
            We aim to provide accessible investment opportunities with transparent returns, 
            while building sustainable supply chains through our dropshipping network.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12">Core Values</h2>
          <ul className="space-y-4 mt-4">
            <li className="flex items-start gap-3">
              <span className="text-blue-400">✓</span>
              <span>Transparency in all financial operations</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400">✓</span>
              <span>Innovation through technology</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400">✓</span>
              <span>Community-first approach</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400">✓</span>
              <span>Sustainable wealth generation</span>
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-12">Contact Us</h2>
          <p>
            Have questions? Reach out to our team at{" "}
            <a href="mailto:support@bravecom.in" className="text-blue-400 hover:underline">
              support@bravecom.in
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
