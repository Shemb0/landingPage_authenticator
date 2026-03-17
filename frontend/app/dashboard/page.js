"use client"

import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/login"

// ── ÍCONOS SIMPLES ────────────────────────────────────────────────
function IconCalendar() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}
function IconUsers() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
function IconFolder() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  )
}
function IconLogout() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  )
}

// ── STATS ─────────────────────────────────────────────────────────
const stats = [
  { label: "Citas pendientes",  valor: "8",   Icon: IconCalendar },
  { label: "Clientes activos",  valor: "34",  Icon: IconUsers    },
  { label: "Casos en curso",    valor: "12",  Icon: IconFolder   },
]

// ── CITAS RECIENTES (placeholder) ────────────────────────────────
const citasRecientes = [
  { cliente: "María González",  tipo: "Derecho de Familia",   fecha: "Hoy 10:00",      estado: "Confirmada" },
  { cliente: "Carlos Mendoza",  tipo: "Derecho Comercial",    fecha: "Hoy 14:30",      estado: "Confirmada" },
  { cliente: "Ana Rodríguez",   tipo: "Derecho Inmobiliario", fecha: "Mañana 09:00",   estado: "Pendiente"  },
  { cliente: "Luis Fernández",  tipo: "Derecho Laboral",      fecha: "Mañana 11:00",   estado: "Pendiente"  },
]

export default function DashboardPage() {
  const router  = useRouter()
  const user    = useAuthStore((state) => state.user)
  const logout  = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a0a" }}>

      {/* ── HEADER ──────────────────────────────────────────────── */}
      <header className="border-b px-8 py-5 flex items-center justify-between" style={{ borderColor: "#C9A84C20", backgroundColor: "#0d0d0d" }}>
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 flex items-center justify-center" style={{ backgroundColor: "#C9A84C" }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="#0a0a0a" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7l-9-5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <div>
            <span className="text-white font-bold text-sm">Estudio Jurídico</span>
            <span className="block text-xs uppercase tracking-widest" style={{ color: "#C9A84C60" }}>Panel de administración</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Nombre del usuario */}
          <div className="text-right hidden sm:block">
            <span className="text-white text-sm font-semibold">
              {user ? `${user.first_name} ${user.last_name}` : "Administrador"}
            </span>
            <span className="block text-xs" style={{ color: "#C9A84C80" }}>
              {user?.email}
            </span>
          </div>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "#C9A84C20", color: "#C9A84C", border: "1px solid #C9A84C40" }}>
            {user ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}` : "AD"}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm px-4 py-2 border transition-colors"
            style={{ borderColor: "#C9A84C30", color: "#C9A84C80" }}
          >
            <IconLogout />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </header>

      {/* ── CONTENIDO ───────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 py-12">

        {/* Bienvenida */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-8" style={{ backgroundColor: "#C9A84C" }} />
            <span className="text-xs uppercase tracking-[0.3em]" style={{ color: "#C9A84C" }}>Panel principal</span>
          </div>
          <h1 className="text-3xl font-bold text-white">
            Bienvenido, {user?.first_name ?? "Administrador"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Resumen de actividad del estudio jurídico</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px mb-10" style={{ backgroundColor: "#C9A84C20" }}>
          {stats.map((stat) => (
            <div key={stat.label} className="p-8 flex items-center gap-5" style={{ backgroundColor: "#0f0f0f" }}>
              <div className="w-12 h-12 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#C9A84C15", color: "#C9A84C", border: "1px solid #C9A84C30" }}>
                <stat.Icon />
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{stat.valor}</div>
                <div className="text-xs uppercase tracking-widest mt-1" style={{ color: "#C9A84C80" }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Citas recientes */}
        <div className="border" style={{ backgroundColor: "#0f0f0f", borderColor: "#C9A84C20" }}>
          <div className="px-8 py-5 border-b flex items-center justify-between" style={{ borderColor: "#C9A84C20" }}>
            <div className="flex items-center gap-3">
              <span style={{ color: "#C9A84C" }}><IconCalendar /></span>
              <h2 className="text-white font-bold">Próximas citas</h2>
            </div>
            <span className="text-xs uppercase tracking-widest px-3 py-1 border" style={{ color: "#C9A84C", borderColor: "#C9A84C30" }}>
              {citasRecientes.length} agendadas
            </span>
          </div>

          <div className="divide-y" style={{ borderColor: "#C9A84C10" }}>
            {citasRecientes.map((cita) => (
              <div key={cita.cliente} className="px-8 py-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Avatar cliente */}
                  <div className="w-9 h-9 flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: "#C9A84C10", color: "#C9A84C", border: "1px solid #C9A84C20" }}>
                    {cita.cliente.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">{cita.cliente}</div>
                    <div className="text-xs mt-0.5" style={{ color: "#C9A84C60" }}>{cita.tipo}</div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <span className="text-gray-500 text-xs">{cita.fecha}</span>
                  <span
                    className="text-xs px-3 py-1 uppercase tracking-widest"
                    style={{
                      backgroundColor: cita.estado === "Confirmada" ? "#C9A84C15" : "#ffffff08",
                      color:           cita.estado === "Confirmada" ? "#C9A84C"   : "#6b7280",
                      border:          `1px solid ${cita.estado === "Confirmada" ? "#C9A84C30" : "#ffffff10"}`,
                    }}
                  >
                    {cita.estado}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}
