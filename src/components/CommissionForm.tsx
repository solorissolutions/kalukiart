"use client";

import { useState } from "react";

export default function CommissionForm() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const update = (field: keyof typeof formData, value: string) => setFormData({ ...formData, [field]: value });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const to = "hello@kaluki.art";
    const subject = formData.subject?.trim() || "Website contact";
    const body = [
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      "",
      formData.message,
    ].join("\n");

    const href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
    setStatus("sent");
  };

  return (
    <section
      id="contact"
      className="py-24 px-6 bg-gradient-to-b from-umbra via-[#3A2F27] to-bone text-bone"
    >
      <div className="max-w-2xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl text-center mb-4 text-bone">Contact</h2>
        <p className="text-center text-bone/80 mb-12">Send a message and we’ll get back to you.</p>

        <div className="bg-bone/95 text-umbra rounded-xl shadow-lg p-8 border border-bone/40">
          {status === "sent" ? (
            <div className="text-center py-10">
              <h3 className="font-display text-2xl mb-3 !text-umbra">Opening your email app…</h3>
              <p className="!text-umbra/80">
                If it didn’t open automatically, email us at <span className="font-semibold !text-umbra">hello@kaluki.art</span>.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 !text-umbra" htmlFor="contact-name">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-umbra/25 bg-white !text-umbra !placeholder:text-umbra/40 focus:outline-none focus:ring-2 focus:ring-ochre"
                    style={{ color: "#2B241E" }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 !text-umbra" htmlFor="contact-email">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-umbra/25 bg-white !text-umbra !placeholder:text-umbra/40 focus:outline-none focus:ring-2 focus:ring-ochre"
                    style={{ color: "#2B241E" }}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 !text-umbra" htmlFor="contact-subject">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => update("subject", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-umbra/25 bg-white !text-umbra !placeholder:text-umbra/40 focus:outline-none focus:ring-2 focus:ring-ochre"
                  style={{ color: "#2B241E" }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 !text-umbra" htmlFor="contact-message">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={6}
                  value={formData.message}
                  onChange={(e) => update("message", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-umbra/25 bg-white !text-umbra !placeholder:text-umbra/40 focus:outline-none focus:ring-2 focus:ring-ochre resize-none"
                  style={{ color: "#2B241E" }}
                  required
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-ochre text-white rounded-full hover:bg-ochre/90 transition-colors"
                >
                  Send Message
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
