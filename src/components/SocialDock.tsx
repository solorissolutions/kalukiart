"use client";

import { Instagram, Linkedin, Mail } from "lucide-react";

const links = [
  { href: "https://instagram.com/_artkaluki_", label: "Instagram", icon: Instagram },
  { href: "https://linkedin.com/in/kaluki", label: "LinkedIn", icon: Linkedin },
  { href: "mailto:hello@kaluki.art", label: "Email", icon: Mail },
];

export default function SocialDock() {
  return (
    <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-3 md:flex-row">
      {links.map(({ href, label, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target={label !== "Email" ? "_blank" : undefined}
          rel={label !== "Email" ? "noopener noreferrer" : undefined}
          aria-label={label}
          className="bg-umbra/90 backdrop-blur-sm text-bone p-3 rounded-full hover:bg-ochre transition-colors interactive"
        >
          <Icon size={20} />
        </a>
      ))}
    </div>
  );
}
