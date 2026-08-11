"use client";

import { useEffect, useState } from "react";
import { SITE, NAV_SERVICES, NAV_MOBILE, HERO } from "@/lib/data";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav${scrolled ? " is-scrolled" : ""}`} id="siteNav">
      <div className="nav-inner">
        <button
          className="nav-burger"
          id="navBurger"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>
        <a href="#top" className="nav-logo">
          {SITE.name.toUpperCase()}
          <span className="dot">.</span>
        </a>
        <nav className="nav-links" aria-label="Services">
          {NAV_SERVICES.map((service) => (
            <a key={service.label} href={service.href}>
              {service.label}
            </a>
          ))}
        </nav>
        <a href="#contact" className="nav-cta">
          {HERO.ctaPrimary}
        </a>
      </div>
      <div className={`nav-mobile${open ? " is-open" : ""}`} id="navMobile">
        {NAV_MOBILE.map((item) => (
          <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </a>
        ))}
      </div>
    </header>
  );
}
