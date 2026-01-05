"use client";

import { ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-umbra text-bone py-12 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-display text-2xl mb-4">Kaluki</h3>
          <p className="text-sm text-bone/80">
            Hyper‑realistic pencil & charcoal drawings celebrating African identity.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Shipping & Authenticity</h4>
          <ul className="text-sm text-bone/80 space-y-2">
            <li>Archival packaging: acid‑free glassine, moisture‑sealed tubes</li>
            <li>Certificate of authenticity with every piece</li>
            <li>Worldwide tracked shipping</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Collector’s FAQ</h4>
          <ul className="text-sm text-bone/80 space-y-2">
            <li>Do you offer commissions? <span className="block text-bone/60">Yes – inquire via contact.</span></li>
            <li>Can I view a piece in situ? <span className="block text-bone/60">Digital mockups available on request.</span></li>
            <li>What about returns? <span className="block text-bone/60">Damaged items replaced; otherwise final sale.</span></li>
          </ul>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-bone/20 text-center text-sm text-bone/60">
        <p>&copy; 2026 Kaluki. All rights reserved.</p>
        <button
          onClick={scrollToTop}
          className="mt-4 inline-flex items-center gap-2 bg-ochre hover:bg-ochre/90 text-white px-4 py-2 rounded-full transition-colors"
          aria-label="Back to top"
        >
          <ArrowUp size={16} /> Back to Top
        </button>
      </div>
    </footer>
  );
}
