import Link from "next/link";
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
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
        <h1 className="text-5xl md:text-6xl font-black mb-8">Contact Us</h1>
        
        <p className="text-lg text-slate-300 mb-12">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="text-blue-400" />
                </div>
                <div>
                  <p className="font-bold text-white">Email</p>
                  <p className="text-slate-400">support@bravecom.in</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="text-green-400" />
                </div>
                <div>
                  <p className="font-bold text-white">Phone</p>
                  <p className="text-slate-400">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="text-purple-400" />
                </div>
                <div>
                  <p className="font-bold text-white">Address</p>
                  <p className="text-slate-400">
                    Brave Ecom Pvt Ltd<br />
                    Mumbai, Maharashtra<br />
                    India - 400001
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
            
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">First Name</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Last Name</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" placeholder="Doe" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                <input type="email" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" placeholder="john@example.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Message</label>
                <textarea rows={5} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" placeholder="Your message..."></textarea>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-lg transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
