"use client";

import Header from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StyleOracle from "@/components/style-oracle";
// ✅ Fixed: Aliased 'Lock' to 'LockIcon' to completely separate it from Mongoose's internal class namespace
import { Scale, ShoppingBag, GraduationCap, Gavel, AlertTriangle, ShieldAlert, Lock as LockIcon } from "lucide-react";

export default function TermsOfServicePage() {
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
          <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-400 uppercase font-bold block">HOUSE DIGITAL OPERATIONAL STANDARD</span>
          <h1 style={{ fontFamily: "var(--font-playfair), serif" }} className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-zinc-900">Terms of Service</h1>
          <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest pt-1">Effective Revision Index // June 2026</p>
        </header>

        {/* Section 1 */}
        <section className="legal-section">
          <h3 className="legal-section-title"><Scale size={14} /> 1. Acceptance of Terms</h3>
          <p className="legal-body">
            By initializing a passport profile node, browsing the showroom collections, streaming dynamic fashion films, or submitting an application to the Norex Design Academy, you explicitly agree to be bound by these Terms of Service. If you disagree with any segment of these operational protocols, you must terminate your session immediately.
          </p>
        </section>

        {/* Section 2 */}
        <section className="legal-section">
          <h3 className="legal-section-title"><ShoppingBag size={14} /> 2. Showroom Transactions & Custom Bespoke Orders</h3>
          <p className="legal-body">
            All prices listed across the storefront catalog are subject to variation depending on material swatches and fit configurations. Custom orders finalized through our secure WhatsApp gateway represent an intent to purchase. While we make every structural calculation to ensure absolute alignment, variance in organic textiles or digital screen tones may occur. Norex reserves the right to restrict or cancel order dispatches due to raw material deficits or allocation limits.
          </p>
        </section>

        {/* Section 3 */}
        <section className="legal-section">
          <h3 className="legal-section-title"><GraduationCap size={14} /> 3. Academy Matriculation & Tuition Protocols</h3>
          <p className="legal-body">
            Enrollment in the Norex Design Academy curriculum milestones is restricted to applicants who have successfully cleared the review stage. Tuition fees must be fully processed or wired according to agreed payment schedules. Academy access, curriculum resources, and project evaluation reviews are non-transferable. Disruption of studio learning metrics, plagiarism of design blueprints, or failure to commit installments within stipulated windows will result in instant suspension of profile clearance privileges.
          </p>
        </section>

        {/* Section 4 */}
        <section className="legal-section">
          {/* ✅ Fixed: Swapped <Lock /> for your clean <LockIcon /> to satisfy the compiler */}
          <h3 className="legal-section-title"><LockIcon size={14} /> 4. Intellectual Property Rights</h3>
          <p className="legal-body">
            All content hosted across this ecosystem—including asymmetric garment designs, couture sketches, geometric contour parameters, digital logical structures, lesson blueprints, fashion film campaigns, logos, and structural code files—remains the exclusive property of Norex Fashion House. Unauthorized reproduction, modification, duplication, or deployment of these assets for alternative commercial or educational purposes is strictly prohibited.
          </p>
        </section>

        {/* Section 5 */}
        <section className="legal-section">
          <h3 className="legal-section-title"><AlertTriangle size={14} /> 5. Limitation of Liability</h3>
          <p className="legal-body">
            Norex Fashion House, its directors, and its design instructors shall under no circumstances be held liable for indirect, incidental, or consequential damages resulting from connection timeouts, database sync anomalies, or third-party SMTP transmission errors. Garments are compiled as artistic couture pieces; the House is not responsible for wear-and-tear degradation caused by improper care or maintenance handling.
          </p>
        </section>

        {/* Section 6 */}
        <section className="legal-section">
          <h3 className="legal-section-title"><ShieldAlert size={14} /> 6. Account Integrity & Security Shield</h3>
          <p className="legal-body">
            You are entirely responsible for protecting your secure user credentials dashboard password. Admin sessions are decoupled from standard user database tables to maximize protection parameters. If any security breach, unsanctioned login loop, or token leakage is detected on your passport node, you are instructed to report the event to the system rectors immediately via <a href="mailto:admin@norexfashion.com" className="mail-link">admin@norexfashion.com</a>.
          </p>
        </section>

        {/* Section 7 */}
        <section className="legal-section">
          <h3 className="legal-section-title"><Gavel size={14} /> 7. Governing Law & Jurisdiction</h3>
          <p className="legal-body">
            These operational terms and conditions shall be governed by, construed, and enforced in accordance with the laws of the Federal Republic of Nigeria. Any disputes arising directly from storefront transactions or student matriculation issues shall be subject to the exclusive jurisdiction of the state or federal courts sitting in Delta State, Nigeria.
          </p>
        </section>

        {/* Footer Confirmation Notice */}
        <div className="p-4 bg-zinc-50 border rounded-sm text-center text-[10px] font-mono tracking-wider font-bold text-zinc-400 uppercase">
          NOREX ATELIER TERMS ENGINE CONTROL REGISTERED // WARRI, NIGERIA
        </div>

      </div>

      <StyleOracle />
    </main>
  );
}