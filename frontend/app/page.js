import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import ChatWidget from "@/components/ChatWidget";
import FormCita from "@/components/FormCita";
import FormContacto from "@/components/FormContacto";
import {
  IconScales, IconBuilding, IconFamily, IconHouse,
  IconBriefcase, IconShield, IconGavel, IconCalendar, IconMail
} from "@/components/Icons";

const servicios = [
  { Icon: IconScales, titulo: "Derecho Civil", descripcion: "Contratos, sucesiones, daños y perjuicios. Representación integral en conflictos civiles." },
  { Icon: IconBuilding, titulo: "Derecho Comercial", descripcion: "Constitución de sociedades, contratos comerciales y resolución de disputas empresariales." },
  { Icon: IconFamily, titulo: "Derecho de Familia", descripcion: "Divorcios, adopciones, alimentos y tenencia. Acompañamiento en cada etapa del proceso." },
  { Icon: IconHouse, titulo: "Derecho Inmobiliario", descripcion: "Compraventas, alquileres, usucapión y regularización de propiedades." },
  { Icon: IconBriefcase, titulo: "Derecho Laboral", descripcion: "Defensa de trabajadores y empleadores en conflictos laborales, despidos e indemnizaciones." },
  { Icon: IconShield, titulo: "Derecho Penal", descripcion: "Defensa penal, recursos y apelaciones. Asesoramiento en denuncias e investigaciones." },
];

const casos = [
  { Icon: IconBuilding, categoria: "Derecho Comercial", titulo: "Disputa societaria entre socios fundadores", descripcion: "Resolución de conflicto entre socios de empresa tecnológica por distribución de utilidades y derechos de decisión. Acuerdo extrajudicial favorable.", resultado: "Acuerdo favorable", duracion: "4 meses" },
  { Icon: IconBriefcase, categoria: "Derecho Laboral", titulo: "Demanda por despido injustificado", descripcion: "Representación de trabajador ante despido sin causa en empresa multinacional. Obtención de indemnización completa más daños y perjuicios.", resultado: "Sentencia ganada", duracion: "8 meses" },
  { Icon: IconHouse, categoria: "Derecho Inmobiliario", titulo: "Regularización de propiedad heredada", descripcion: "Proceso de usucapión y regularización dominial de inmueble ocupado por 20 años sin escritura. Escritura obtenida en tiempo récord.", resultado: "Escritura obtenida", duracion: "6 meses" },
  { Icon: IconFamily, categoria: "Derecho de Familia", titulo: "Tenencia compartida y régimen de visitas", descripcion: "Acuerdo de tenencia compartida con régimen de visitas flexible para ambos progenitores, priorizando el bienestar de los menores.", resultado: "Acuerdo homologado", duracion: "3 meses" },
  { Icon: IconShield, categoria: "Derecho Penal", titulo: "Defensa en causa por estafa comercial", descripcion: "Defensa exitosa de empresario imputado por estafa. Sobreseimiento definitivo por falta de mérito tras investigación exhaustiva.", resultado: "Sobreseimiento", duracion: "10 meses" },
  { Icon: IconScales, categoria: "Derecho Civil", titulo: "Reclamo por daños y perjuicios", descripcion: "Representación de cliente en accidente de tránsito con lesiones graves. Indemnización integral obtenida incluyendo daño moral.", resultado: "Indemnización íntegra", duracion: "12 meses" },
];

const testimonios = [
  { texto: "El equipo me acompañó en todo el proceso de divorcio con mucha profesionalidad y empatía. Estoy muy agradecida.", nombre: "María González", cargo: "Clienta" },
  { texto: "Resolvieron un conflicto societario complejo en tiempo récord. Excelente trabajo y comunicación permanente.", nombre: "Carlos Mendoza", cargo: "Empresario" },
  { texto: "Me asesoraron en la compra de mi primera propiedad y evitaron problemas que ni imaginaba. Los recomiendo.", nombre: "Ana Rodríguez", cargo: "Cliente" },
];

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a0a" }}>
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="absolute left-16 top-0 bottom-0 w-px hidden lg:block" style={{ background: "linear-gradient(to bottom, transparent, #C9A84C40, transparent)" }} />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-16 pt-32 pb-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Columna izquierda: texto */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px w-12" style={{ backgroundColor: "#C9A84C" }} />
                <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: "#C9A84C" }}>
                  Estudio Jurídico Profesional
                </span>
              </div>

              <h1 className="text-6xl lg:text-7xl font-bold leading-tight mb-2 text-white">
                Bienvenido al
              </h1>
              <h1 className="text-6xl lg:text-7xl font-bold leading-tight mb-8" style={{ color: "#C9A84C" }}>
                Estudio Jurídico
              </h1>

              <div className="flex items-center gap-3 mb-8">
                <div className="h-px flex-1 max-w-xs" style={{ background: "linear-gradient(90deg, #C9A84C, transparent)" }} />
                <div className="w-2 h-2 rotate-45" style={{ backgroundColor: "#C9A84C" }} />
              </div>

              <p className="text-gray-400 text-lg leading-relaxed mb-12 max-w-xl">
                Asesoramiento jurídico profesional, honesto y efectivo. Más de 15 años protegiendo los derechos e intereses de nuestros clientes con resultados comprobables.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/#contacto"
                  className="btn-gold px-10 py-4 font-semibold text-sm uppercase tracking-widest transition-all"
                  style={{ backgroundColor: "#C9A84C", color: "#0a0a0a" }}
                >
                  Reservar Consulta
                </Link>
                <Link
                  href="/#casos"
                  className="btn-hero-secondary px-10 py-4 font-semibold text-sm uppercase tracking-widest border transition-all text-white"
                  style={{ borderColor: "#C9A84C40" }}
                >
                  Ver Casos
                </Link>
              </div>
            </div>

            {/* Columna derecha: imagen */}
            <div className="relative hidden lg:flex items-center justify-center">
              {/* Marco decorativo dorado */}
              <div className="absolute -top-4 -left-4 w-full h-full border pointer-events-none" style={{ borderColor: "#C9A84C30" }} />
              <div className="absolute -bottom-4 -right-4 w-full h-full border pointer-events-none" style={{ borderColor: "#C9A84C15" }} />

              {/* Imagen */}
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4/5" }}>
                <img
                  src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80"
                  alt="Estudio Jurídico Profesional"
                  className="w-full h-full object-cover"
                  style={{ filter: "grayscale(20%) contrast(1.05)" }}
                />
                {/* Overlay oscuro para integrar con la paleta */}
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(10,10,10,0.7) 100%), linear-gradient(to right, rgba(10,10,10,0.3) 0%, transparent 40%)" }} />
                {/* Badge dorado sobre la imagen */}
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex items-center gap-3 px-5 py-3" style={{ backgroundColor: "rgba(10,10,10,0.85)", border: "1px solid #C9A84C40" }}>
                    <div className="w-1 h-8 flex-shrink-0" style={{ backgroundColor: "#C9A84C" }} />
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: "#C9A84C" }}>15+ años</div>
                      <div className="text-white text-sm font-medium">de experiencia jurídica</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-xs uppercase tracking-widest" style={{ color: "#C9A84C40" }}>Scroll</span>
          <div className="w-px h-12" style={{ background: "linear-gradient(to bottom, #C9A84C60, transparent)" }} />
        </div>
      </section>

      {/* STRIP DE STATS */}
      <div style={{ backgroundColor: "#C9A84C" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { numero: "15+", label: "Años de experiencia" },
              { numero: "500+", label: "Casos resueltos" },
              { numero: "98%", label: "Clientes satisfechos" },
              { numero: "24/7", label: "Asistente disponible" },
            ].map((stat, i) => (
              <div key={stat.label} className={`py-8 px-6 text-center ${i < 3 ? "border-r border-black/10" : ""}`}>
                <div className="text-3xl font-bold text-black">{stat.numero}</div>
                <div className="text-black/70 text-xs uppercase tracking-widest mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SERVICIOS */}
      <section id="servicios" className="py-28" style={{ backgroundColor: "#0f0f0f" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: "#C9A84C" }}>Lo que ofrecemos</span>
            <h2 className="text-4xl font-bold text-white mt-4 mb-5">Áreas de Práctica</h2>
            <div className="gold-divider" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ backgroundColor: "#C9A84C20" }}>
            {servicios.map((servicio) => (
              <div key={servicio.titulo} className="service-card p-10 transition-all duration-300" style={{ backgroundColor: "#0f0f0f" }}>
                <div className="mb-6" style={{ color: "#C9A84C" }}><servicio.Icon size={28} /></div>
                <div className="w-8 h-px mb-5" style={{ backgroundColor: "#C9A84C" }} />
                <h3 className="text-lg font-bold text-white mb-3">{servicio.titulo}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{servicio.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CASOS RESUELTOS */}
      <section id="casos" className="py-28" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: "#C9A84C" }}>Nuestra trayectoria</span>
            <h2 className="text-4xl font-bold text-white mt-4 mb-5">Casos Resueltos</h2>
            <div className="gold-divider" />
            <p className="text-gray-500 mt-6 max-w-xl mx-auto text-sm leading-relaxed">
              Resultados concretos que respaldan nuestra experiencia y compromiso con cada cliente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {casos.map((caso) => (
              <div key={caso.titulo} className="card-hover p-8 border transition-all duration-300" style={{ backgroundColor: "#0f0f0f", borderColor: "#C9A84C20" }}>
                <div className="flex items-center gap-3 mb-6">
                  <span style={{ color: "#C9A84C" }}><caso.Icon size={18} /></span>
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#C9A84C" }}>{caso.categoria}</span>
                </div>
                <div className="w-8 h-px mb-5" style={{ backgroundColor: "#C9A84C50" }} />
                <h3 className="text-white font-bold mb-4 leading-snug text-base">{caso.titulo}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">{caso.descripcion}</p>
                <div className="flex items-center justify-between pt-5" style={{ borderTop: "1px solid #C9A84C20" }}>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#C9A84C" }} />
                    <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#C9A84C" }}>{caso.resultado}</span>
                  </div>
                  <span className="text-xs text-gray-600">{caso.duracion}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="relative py-28 overflow-hidden" style={{ backgroundColor: "#0d1117" }}>
        {/* Fondo con gradientes y grilla (traído del hero) */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.05) 0%, transparent 50%)" }} />
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(201,168,76,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.3) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
          <div className="absolute right-0 bottom-0 opacity-5 text-[300px] leading-none pointer-events-none select-none hidden xl:block" style={{ color: "#C9A84C", fontFamily: "serif" }}>⚖</div>
        </div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: "#C9A84C" }}>Lo que dicen nuestros clientes</span>
            <h2 className="text-4xl font-bold text-white mt-4 mb-5">Testimonios</h2>
            <div className="gold-divider" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonios.map((t) => (
              <div key={t.nombre} className="p-8 border" style={{ backgroundColor: "#0a0a0a", borderColor: "#C9A84C20" }}>
                <div className="text-5xl font-serif mb-6 leading-none" style={{ color: "#C9A84C" }}>"</div>
                <p className="text-gray-400 leading-relaxed mb-8 text-sm">{t.texto}</p>
                <div className="flex items-center gap-4 pt-5" style={{ borderTop: "1px solid #C9A84C20" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "#C9A84C20", color: "#C9A84C", border: "1px solid #C9A84C40" }}>
                    {t.nombre.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{t.nombre}</div>
                    <div className="text-xs text-gray-600 mt-0.5">{t.cargo}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ASISTENTE IA */}
      <section id="asistente" className="py-20 border-y" style={{ backgroundColor: "#0a0a0a", borderColor: "#C9A84C20" }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-8" style={{ backgroundColor: "#C9A84C20", border: "1px solid #C9A84C40", color: "#C9A84C" }}><IconGavel size={30} /></div>
          <span className="block text-xs uppercase tracking-[0.3em] font-medium mb-4" style={{ color: "#C9A84C" }}>Tecnología al servicio de la justicia</span>
          <h2 className="text-3xl font-bold text-white mb-4">Asistente Legal con Inteligencia Artificial</h2>
          <div className="gold-divider mb-6" />
          <p className="text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto text-sm">
            Consultá con nuestro asistente legal inteligente disponible las 24 horas. Podés subir tus documentos en PDF y recibir orientación jurídica inmediata.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
            {["Consultas en tiempo real", "Análisis de documentos PDF", "Disponible 24/7", "Sin turno previo"].map(item => (
              <span key={item} className="flex items-center gap-2 px-4 py-2" style={{ border: "1px solid #C9A84C20" }}>
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: "#C9A84C" }} /> {item}
              </span>
            ))}
          </div>
          <p className="text-xs mt-8 uppercase tracking-widest" style={{ color: "#C9A84C60" }}>
            Hacé clic en ⚖️ abajo a la derecha para comenzar
          </p>
        </div>
      </section>

      {/* FORMULARIOS */}
      <section id="contacto" className="py-28" style={{ backgroundColor: "#0f0f0f" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: "#C9A84C" }}>Estamos para ayudarte</span>
            <h2 className="text-4xl font-bold text-white mt-4 mb-5">Contacto y Citas</h2>
            <div className="gold-divider" />
            <p className="text-gray-500 mt-6 max-w-xl mx-auto text-sm leading-relaxed">
              Reservá una consulta con nuestros abogados o envianos un mensaje. Te respondemos a la brevedad.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* CITA */}
            <div className="p-10 border" style={{ backgroundColor: "#0a0a0a", borderColor: "#C9A84C20" }}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 flex items-center justify-center" style={{ backgroundColor: "#C9A84C", color: "#0a0a0a" }}><IconCalendar size={20} /></div>
                <div>
                  <h3 className="text-lg font-bold text-white">Reservar Cita</h3>
                  <p className="text-gray-500 text-xs uppercase tracking-wide mt-0.5">Agendá tu consulta presencial</p>
                </div>
              </div>

              <FormCita />
            </div>

            {/* CONTACTO */}
            <div className="p-10 border" style={{ backgroundColor: "#0a0a0a", borderColor: "#C9A84C20" }}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 flex items-center justify-center border" style={{ borderColor: "#C9A84C40", color: "#C9A84C" }}><IconMail size={20} /></div>
                <div>
                  <h3 className="text-lg font-bold text-white">Enviar Mensaje</h3>
                  <p className="text-gray-500 text-xs uppercase tracking-wide mt-0.5">Te respondemos en menos de 24 hs</p>
                </div>
              </div>

              <FormContacto />
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
}
