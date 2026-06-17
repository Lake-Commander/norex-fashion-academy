"use client";

import Header from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StyleOracle from "@/components/style-oracle";
import { ShieldCheck, Lock, Eye, Key } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#FCFAF7] text-zinc-800 text-left antialiased font-sans flex flex-col justify-between overflow-x-hidden pt-24">
      <Header />

      <style>{`
        .legal-container { max-w: 3xl; width: 100%; margin: 4rem auto 6rem auto; padding: 0 1.5rem; space-y: 2.5rem; }
        .legal-header { border-bottom: 2px solid #1a1a1a; padding-bottom: 1.5rem; margin-bottom: 3rem; text-center; }
        .legal-section { margin-bottom: 2.5rem; }
        .legal-section-title { font-size: 0.85rem; font-weight: 900; font-family: monospace; letter-spacing: 0.2em; text-transform: uppercase; color: #C9A84C; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; }
        .legal-body { font-size: 0.9rem; line-height: 1.85; color: #4b5563; font-family: sans-serif; font-light; text-align: justify; }
      `}</style>

      <div className="legal-container">
        
        {/* Header Block */}
        <header className="legal-header text-center space-y-3">
          <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-400 uppercase font-bold block">HOUSE PROTOCOL SECURE DIRECTIVE</span>
          <h1 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-zinc-900">Privacy Policy</h1>
          <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest pt-1">Effective Release Index // Seasonal 2026</p>
        </header>

        {/* Section 1 */}
        <section className="legal-section">
          <h3 className="legal-section-title"><ShieldCheck size={14} /> 1. Operational Statement Data Collection</h3>
          <p className="legal-body">
            Norex Fashion House operates as an integrated e-commerce architecture and tailoring academy registry. We collect user attributes required to fulfill luxury garment processing and student matriculation portfolios. This covers full legal names, electronic mail fields, voice phone connections, shipping destinations, card processing coordinates, and architectural measurement matrices.
          </p>
        </section>

        {/* Section 2 */}
        <section className="legal-section">
          <h3 className="legal-section-title"><Eye size={14} /> 2. Interaction Telemetry & Behavior Tracker</h3>
          <p className="legal-body">
            To provide a bespoke, personalized dashboard experience, our front-end interaction hooks silently collect configuration tokens. This encompasses reading logs across the Gazette editorial sheets, cinematic films watch history logs, and product catalog files scanned during active user boot sessions. This tracking layer runs exclusively to populate recommended sizes grids and "recently viewed" backlog panels.
          </p>
        </section>

        {/* Section 3 */}
        <section className="legal-section">
          <h3 className="legal-section-title"><Lock size={14} /> 3. Cryptographic Storage & Security Measures</h3>
          <p className="legal-body">
            All user passport credentials and password fields are encrypted using one-way cryptographic salting algorithms (Bcrypt.js) before storage in our clusters database collections. Master admin credentials remain locked inside secure environment partitions isolated from public data pipes. Outbound recovery token generation utilizes cryptographic random byte handshakes restricted to 60-minute active lifespans.
          </p>
        </section>

        {/* Section 4 */}
        <section className="legal-section">
          <h3 className="legal-section-title"><Key size={14} /> 4. Third-Party Handshakes & Outbound Pipes</h3>
          <p className="legal-body">
            We do not swap, trade, or distribute your identity indices to analytical brokers. External data sharing is strictly limited to transaction processing pipelines: processing mailing dispatches securely via local Lytehosting SMTP relays, initializing manual cart orders through secure WhatsApp workspace lines, and verifying identity handshakes dynamically using NextAuth Google OAuth servers.
          </p>
        </section>

        {/* Footer Confirmation Notice */}
        <div className="p-4 bg-zinc-50 border rounded-sm text-center text-[10px] font-mono tracking-wider font-bold text-zinc-400 uppercase">
          NOREX ATELIER STATIONS DATA SHIELD ASSURED // WARRI, NIGERIA
        </div>

      </div>

      <StyleOracle />
      <Footer />
    </main>
  );
}