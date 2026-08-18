"use client";

import { useRef } from "react";
import { useReveal } from "@/hooks/useReveal";
import { CONTACT, SITE } from "@/lib/data";

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section className="contact has-loops" id="contact" ref={ref}>
      <div className="section-loops" aria-hidden="true">
        <span className="sl sl--yellow sl-lg sl-tl sl-d3" />
        <span className="sl sl--orange-d sl-sm sl-br sl-d6" />
        <span className="sl sl--lime sl-md sl-tr sl-d1" />
      </div>
      <div className="contact-inner">
        <span className="section-eyebrow">{CONTACT.eyebrow}</span>
        <h2 className="contact-title">
          {CONTACT.title[0]}
          <br />
          <span className="text-outline">{CONTACT.title[1]}</span>
        </h2>
        <p className="contact-sub">{CONTACT.sub}</p>

        <div className="contact-grid">
          <a href={`mailto:${SITE.email}`} className="contact-link">
            <span className="contact-label">Email</span>
            <span className="contact-value">{SITE.email}</span>
          </a>
          {SITE.phones.map((phone) => (
            <a key={phone.href} href={phone.href} className="contact-link">
              <span className="contact-label">{phone.label}</span>
              <span className="contact-value">{phone.value}</span>
            </a>
          ))}
          <div className="contact-link contact-link--static">
            <span className="contact-label">Studio</span>
            <span className="contact-value">{SITE.location}, India</span>
          </div>
        </div>
      </div>
    </section>
  );
}
