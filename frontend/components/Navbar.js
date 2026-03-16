import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: "rgba(10,10,10,0.95)", borderBottom: "1px solid rgba(201,168,76,0.15)", backdropFilter: "blur(10px)" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center" style={{ backgroundColor: "#C9A84C" }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="#0a0a0a" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7l-9-5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <span className="text-white font-bold tracking-wide text-base" style={{ fontFamily: "var(--font-playfair)" }}>
            Estudio Jurídico
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-10">
          {[
            { href: "/#servicios", label: "Servicios" },
            { href: "/#casos", label: "Casos" },
            { href: "/#contacto", label: "Contacto" },
            { href: "/#asistente", label: "Asistente IA" },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link text-xs uppercase tracking-widest font-medium transition-colors"
              style={{ color: "#9ca3af" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link
          href="/#contacto"
          className="btn-gold text-xs uppercase tracking-widest font-semibold px-6 py-3 transition-all"
          style={{ backgroundColor: "#C9A84C", color: "#0a0a0a" }}
        >
          Reservar Cita
        </Link>
      </div>
    </header>
  );
}
