import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#080808", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 flex items-center justify-center" style={{ backgroundColor: "#C9A84C" }}>
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="#0a0a0a" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7l-9-5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <span className="font-bold text-white text-lg" style={{ fontFamily: "var(--font-playfair)" }}>
                Estudio Jurídico
              </span>
            </div>
            <div className="w-8 h-px mb-5" style={{ backgroundColor: "#C9A84C" }} />
            <p className="text-gray-600 text-sm leading-relaxed">
              Asesoramiento legal profesional con más de 15 años de experiencia brindando soluciones confiables.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-6 text-xs uppercase tracking-widest" style={{ color: "#C9A84C" }}>Navegación</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              {[
                { href: "/#servicios", label: "Áreas de Práctica" },
                { href: "/#casos", label: "Casos Resueltos" },
                { href: "/#contacto", label: "Reservar Cita" },
                { href: "/#asistente", label: "Asistente Legal IA" },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors flex items-center gap-2">
                    <span className="w-3 h-px inline-block" style={{ backgroundColor: "#C9A84C40" }} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-semibold mb-6 text-xs uppercase tracking-widest" style={{ color: "#C9A84C" }}>Contacto</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <span style={{ color: "#C9A84C" }}>—</span>
                Av. Principal 1234, Buenos Aires
              </li>
              <li className="flex items-start gap-3">
                <span style={{ color: "#C9A84C" }}>—</span>
                +54 11 1234-5678
              </li>
              <li className="flex items-start gap-3">
                <span style={{ color: "#C9A84C" }}>—</span>
                contacto@estudiojuridico.com
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-700" style={{ borderTop: "1px solid rgba(201,168,76,0.1)" }}>
          <span>© {new Date().getFullYear()} Estudio Jurídico. Todos los derechos reservados.</span>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: "#C9A84C" }} />
            <span style={{ color: "#C9A84C60" }}>Justicia · Integridad · Resultados</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
