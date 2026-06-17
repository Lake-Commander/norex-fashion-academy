"use client";

import Header from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StyleOracle from "@/components/style-oracle";
// ✅ Fixed: Added 'Clock' to the named imports destructuring statement below
import { ShieldCheck, Lock, Eye, Key, Trash2, Cookie, UserCheck, HelpCircle, Clock } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#FCFAF7] text-zinc-800 text-left antialiased font-sans flex flex-col justify-between overflow-x-hidden pt-24">
      <Header />

      <style>{`
        .legal-container { max-w: 3xl; width: 100%; margin: 4rem auto 6rem auto; padding: 0 1.5rem; space-y: 2.5rem; }
        .legal-header { border-bottom: 2px solid #1a1a1a; padding-bottom: 1.5rem; margin-bottom: 3rem; text-center; }
        .legal-section { margin-bottom: 2.5rem; }
        .legal-section-title { font-size: 0.85rem; font-weight: 900; font-family: monospace; letter-spacing: 0.2em; text-transform: uppercase; color: #C9A84C; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; }
        .legal-body { font-size: 0.9rem; line-height: 1.85; color: #4b5563; font-family: sans-serif; font-weight: 300; text-align: justify; }
        .mail-link { color: #C9A84C; font-weight: bold; text-decoration: none; border-bottom: 1px dashed #C9A84C; transition: all 0.2s; }
        .mail-link:hover { color: #1a1a1a; border-bottom-color: #1a1a1a; }
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
          <h3 className="legal-section-title"><Cookie size={14} /> 3. Cookies & Local Session Cache Pointers</h3>
          <p className="legal-body">
            We utilize persistent cookies and local storage tokens to safeguard browser connection states, sustain active user logins across NextAuth handlers, and retain e-commerce cart counts. These elements track session identity metrics locally to optimize server-side page rendering passes and block unauthenticated URL hijacking attempts. You can change your cookie preferences directly inside your local browser layout tools at any time.
          </p>
        </section>

        {/* Section 4 */}
        <section className="legal-section">
          <h3 className="legal-section-title"><Lock size={14} /> 4. Cryptographic Storage & Security Measures</h3>
          <p className="legal-body">
            All user passport credentials and password fields are encrypted using one-way cryptographic salting algorithms (Bcrypt.js) before storage in our clusters database collections. Master admin credentials remain locked inside secure environment partitions isolated from public data pipes. Outbound recovery token generation utilizes cryptographic random byte handshakes restricted to 60-minute active lifespans.
          </p>
        </section>

        {/* Section 5 */}
        <section className="legal-section">
          <h3 className="legal-section-title"><Key size={14} /> 5. Third-Party Handshakes & Outbound Pipes</h3>
          <p className="legal-body">
            We do not swap, trade, or distribute your identity indices to analytical brokers. External data sharing is strictly limited to transaction processing pipelines: processing mailing dispatches securely via local Lytehosting SMTP relays, initializing manual cart orders through secure WhatsApp workspace lines, and verifying identity handshakes dynamically using NextAuth Google OAuth servers.
          </p>
        </section>

        {/* Section 6 */}
        <section className="legal-section">
          <h3 className="legal-section-title"><Clock size={14} /> 6. Data Retention Lifecycles</h3>
          <p className="legal-body">
            We preserve personal telemetry records and billing coordinates only as long as an account registry profile node remains active in our database ecosystem. Anonymous transactional metadata, custom tailored garment measurement records, and institutional academy grades parameters are archived systematically to comply with standard statutory financial bookkeeping laws and educational tracking regulations.
          </p>
        </section>

        {/* Section 7 */}
        <section className="legal-section">
          <h3 className="legal-section-title"><UserCheck size={14} /> 7. Regional Statutory NDPR Rights</h3>
          <p className="legal-body">
            In compliance with the Nigerian Data Protection Regulation (NDPR), users holding passport nodes in our database possess absolute rights to access their registered profiles, correct measurement variation sheets, restrict tracking packets, or withdraw data processing authorization constraints entirely. Contact the House administrative stations at any time to verify your profile clearance tier parameters.
          </p>
        </section>

        {/* Section 8 */}
        <section className="legal-section">
          <h3 className="legal-section-title"><Trash2 size={14} /> 8. Account Deletion Request Registry</h3>
          <p className="legal-body">
            If you wish to terminate your profile passport node and erase all linked telemetry datasets (including active shopping cart history, pinned wishlists, read logs, and billing coordinates) from our database cluster, you may submit a formal deletion request. Please send an email directly to our system administration team at: <a href="mailto:admin@norexfashion.com" className="mail-link">admin@norexfashion.com</a>. 
          </p>
          <p className="legal-body mt-2">
            Your request will be thoroughly checked against your session cookies, verified, and executed across all production tables within forty-eight (48) hours. Please note that active student tuition records cannot be erased during an active academy semester loop.
          </p>
        </section>

        {/* Section 9 */}
        <section className="legal-section">
          <h3 className="legal-section-title"><HelpCircle size={14} /> 9. Policy Revisions</h3>
          <p className="legal-body">
            The House reserves the absolute privilege to update or adjust these security directives to follow evolving digital protocols and regional data protection modifications. Any changes to our server-side parameters will be updated directly on this page layout view, accompanied by a fresh effective release index flag.
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