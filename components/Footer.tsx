"use client";

import { useEffect, useState } from "react";
import { FOOTER } from "@/lib/data";

const variantClass = (variant: string) => {
  if (variant === "outline") return " footer-word--outline";
  if (variant === "fill--accent") return " footer-word--fill";
  return "";
};

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="footer has-loops">
      <div className="section-loops" aria-hidden="true">
        <span className="sl sl--cream sl-lg sl-tl sl-d3" />
        <span className="sl sl--cream sl-sm sl-br sl-d6" />
        <span className="sl sl--yellow sl-md sl-bl sl-d1" />
      </div>
      <div className="footer-top">
        {FOOTER.words.map((word, i) => (
          <span key={i} className={`footer-word${variantClass(word.variant)}`}>
            {word.text}
          </span>
        ))}
      </div>
      <div className="footer-bottom">
        <span>
          © {year ?? ""} {FOOTER.entity}
        </span>
        <div className="footer-links">
          {FOOTER.links.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
        <a href="#top" className="footer-back">
          {FOOTER.back}
        </a>
      </div>
    </footer>
  );
}
