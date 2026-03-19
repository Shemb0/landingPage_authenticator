"use client"

import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/login"
import { useState, useEffect, useCallback } from "react"
import { clienteStore } from "@/store/cliente"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// ── ÍCONOS ────────────────────────────────────────────────────────
function IconCalendar({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}
function IconUsers({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
function IconFolder({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  )
}
function IconHome({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}
function IconLogout({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  )
}
function IconChevronLeft({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}
function IconChevronRight({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}
function IconClock({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
function IconPlus({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}
function IconX({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

// ── MODAL NUEVA CITA ──────────────────────────────────────────────
function ModalNuevaCita({ onClose, onGuardar }) {
  const [form, setForm] = useState({
    client_name: "", client_surname: "", phone_number: "",
    name: "", tipo: "civil", date: "", hora: "",
  })
  const [guardando, setGuardando]     = useState(false)
  const [error, setError]             = useState(null)
  const [slots, setSlots]             = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  useEffect(() => {
    if (!form.date) { setSlots([]); return }
    setLoadingSlots(true)
    setForm(prev => ({ ...prev, hora: "" }))
    fetch(`${API_URL}/citas/slots/?date=${form.date}`)
      .then(r => r.json())
      .then(data => setSlots(data.slots || []))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false))
  }, [form.date])

  const onSubmit = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setError(null)
    try {
      const dateTime = `${form.date}T${form.hora}:00`
      await onGuardar({
        client_name:    form.client_name,
        client_surname: form.client_surname,
        phone_number:   form.phone_number,
        name:           form.name,
        tipo:           form.tipo,
        date:           dateTime,
        estado:         "confirmada",
      })
      onClose()
    } catch (e) {
      setError("No se pudo crear la cita. Revisá los datos.")
    } finally {
      setGuardando(false)
    }
  }

  const inputStyle = {
    backgroundColor: "#0a0a0a",
    border: "1px solid #C9A84C30",
    color: "#e5e7eb",
  }
  const labelStyle = { color: "#C9A84C80", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
      <div className="w-full max-w-lg border" style={{ backgroundColor: "#0f0f0f", borderColor: "#C9A84C30" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "#C9A84C20" }}>
          <div className="flex items-center gap-3">
            <span style={{ color: "#C9A84C" }}><IconCalendar size={18} /></span>
            <h3 className="text-white font-bold">Nueva Cita</h3>
          </div>
          <button onClick={onClose} style={{ color: "#6b7280" }} onMouseEnter={e => e.currentTarget.style.color = "#C9A84C"} onMouseLeave={e => e.currentTarget.style.color = "#6b7280"}>
            <IconX />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Nombre</label>
              <input name="client_name" value={form.client_name} onChange={onChange} required placeholder="Juan" className="w-full mt-1 px-3 py-2.5 text-sm outline-none" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Apellido</label>
              <input name="client_surname" value={form.client_surname} onChange={onChange} required placeholder="Pérez" className="w-full mt-1 px-3 py-2.5 text-sm outline-none" style={inputStyle} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Teléfono</label>
              <input name="phone_number" value={form.phone_number} onChange={onChange} placeholder="+54 11 1234-5678" className="w-full mt-1 px-3 py-2.5 text-sm outline-none" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Área</label>
              <select name="tipo" value={form.tipo} onChange={onChange} className="w-full mt-1 px-3 py-2.5 text-sm outline-none" style={inputStyle}>
                <option value="civil">Derecho Civil</option>
                <option value="comercial">Derecho Comercial</option>
                <option value="familia">Derecho de Familia</option>
                <option value="inmobiliario">Derecho Inmobiliario</option>
                <option value="laboral">Derecho Laboral</option>
                <option value="penal">Derecho Penal</option>
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Motivo de la consulta</label>
            <input name="name" value={form.name} onChange={onChange} required placeholder="Ej: Consulta por contrato de alquiler" className="w-full mt-1 px-3 py-2.5 text-sm outline-none" style={inputStyle} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Fecha</label>
              <input type="date" name="date" value={form.date} onChange={onChange} required className="w-full mt-1 px-3 py-2.5 text-sm outline-none" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Hora</label>
              <select name="hora" value={form.hora} onChange={onChange} required disabled={!form.date || loadingSlots} className="w-full mt-1 px-3 py-2.5 text-sm outline-none" style={{ ...inputStyle, opacity: (!form.date || loadingSlots) ? 0.5 : 1 }}>
                <option value="">
                  {!form.date ? "Elegí una fecha primero" : loadingSlots ? "Cargando..." : slots.length === 0 ? "Sin horarios disponibles" : "Seleccioná un horario"}
                </option>
                {slots.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-semibold border transition-colors" style={{ borderColor: "#C9A84C30", color: "#6b7280" }}>
              Cancelar
            </button>
            <button type="submit" disabled={guardando} className="flex-1 py-3 text-sm font-bold uppercase tracking-widest transition-colors" style={{ backgroundColor: "#C9A84C", color: "#0a0a0a", opacity: guardando ? 0.6 : 1 }}>
              {guardando ? "Guardando..." : "Crear cita"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── STATS BASE ────────────────────────────────────────────────────
const statsBase = [
  { label: "Citas pendientes", Icon: IconCalendar, key: "pendientes" },
  { label: "Clientes activos", Icon: IconUsers,    key: "clientes"   },
  { label: "Casos en curso",   Icon: IconFolder,   key: "casos"      },
]

// ── HOOK: citas desde la API ──────────────────────────────────────
function useCitas(token) {
  const [citas,   setCitas]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const fetchCitas = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/citas/`, {
        headers: { Authorization: `JWT ${token}` },
      })
      if (!res.ok) throw new Error("Error al cargar citas")
      const data = await res.json()
      setCitas(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { fetchCitas() }, [fetchCitas])

  const eliminarCita = async (id) => {
    await fetch(`${API_URL}/citas/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `JWT ${token}` },
    })
    setCitas(prev => prev.filter(c => c.id !== id))
  }

  const actualizarEstado = async (id, estado) => {
    const res = await fetch(`${API_URL}/citas/${id}/`, {
      method: "PATCH",
      headers: {
        Authorization: `JWT ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ estado }),
    })
    const updated = await res.json()
    setCitas(prev => prev.map(c => c.id === id ? updated : c))
  }

  const crearCita = async (data) => {
    const res = await fetch(`${API_URL}/citas/`, {
      method: "POST",
      headers: {
        Authorization: `JWT ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (res.status === 409) throw new Error("Este horario ya fue reservado. Elegí otro.")
    if (!res.ok) throw new Error("Error al crear la cita")
    const nueva = await res.json()
    setCitas(prev => [...prev, nueva])
    return nueva
  }

  return { citas, loading, error, crearCita, eliminarCita, actualizarEstado, refetch: fetchCitas }
}

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]
const DIAS  = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"]

// ── COMPONENTE CALENDARIO ─────────────────────────────────────────
function CalendarioView({ citas, loading, crearCita, eliminarCita, actualizarEstado }) {
  const hoy = new Date()
  const [mes, setMes]             = useState(hoy.getMonth())
  const [anio, setAnio]           = useState(hoy.getFullYear())
  const [diaSeleccionado, setDia] = useState(null)
  const [modalAbierto, setModal]  = useState(false)

  const primerDia = new Date(anio, mes, 1).getDay()
  const diasEnMes = new Date(anio, mes + 1, 0).getDate()

  const celdas = Array(primerDia).fill(null).concat(
    Array.from({ length: diasEnMes }, (_, i) => i + 1)
  )

  // Normaliza la cita de la API al formato que usa el calendario
  const parseCita = (c) => {
    const fecha = new Date(c.date)
    return {
      ...c,
      fecha,
      hora:    fecha.toTimeString().slice(0, 5),
      cliente: `${c.client_name} ${c.client_surname}`,
    }
  }

  const citasNormalizadas = citas.map(parseCita)

  const citasDelDia = (dia) =>
    citasNormalizadas.filter(c =>
      c.fecha.getDate()     === dia &&
      c.fecha.getMonth()    === mes &&
      c.fecha.getFullYear() === anio
    )

  const citasSeleccionadas = diaSeleccionado ? citasDelDia(diaSeleccionado) : []

  const prevMes = () => {
    if (mes === 0) { setMes(11); setAnio(a => a - 1) }
    else setMes(m => m - 1)
    setDia(null)
  }
  const nextMes = () => {
    if (mes === 11) { setMes(0); setAnio(a => a + 1) }
    else setMes(m => m + 1)
    setDia(null)
  }

  const esHoy = (dia) =>
    dia === hoy.getDate() && mes === hoy.getMonth() && anio === hoy.getFullYear()

  const colorEstado = (estado) => ({
    confirmada: { bg: "#C9A84C15", color: "#C9A84C",  border: "#C9A84C30" },
    pendiente:  { bg: "#ffffff08", color: "#6b7280",  border: "#ffffff10" },
    cancelada:  { bg: "#ff000010", color: "#ef4444",  border: "#ff000020" },
  }[estado] ?? { bg: "#ffffff08", color: "#6b7280", border: "#ffffff10" })

  return (
    <>
    {modalAbierto && <ModalNuevaCita onClose={() => setModal(false)} onGuardar={crearCita} />}

    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

      {/* Calendario mensual */}
      <div className="xl:col-span-2 border" style={{ backgroundColor: "#0f0f0f", borderColor: "#C9A84C20" }}>
        <div className="flex items-center justify-between px-8 py-5 border-b" style={{ borderColor: "#C9A84C20" }}>
          <div className="flex items-center gap-3">
            <span style={{ color: "#C9A84C" }}><IconCalendar /></span>
            <h2 className="text-white font-bold">
              {MESES[mes]} <span style={{ color: "#C9A84C" }}>{anio}</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-colors"
              style={{ backgroundColor: "#C9A84C", color: "#0a0a0a" }}
            >
              <IconPlus size={14} /> Nueva cita
            </button>
            <button onClick={prevMes} className="w-8 h-8 flex items-center justify-center border transition-colors hover:border-amber-400" style={{ borderColor: "#C9A84C30", color: "#C9A84C80" }}>
              <IconChevronLeft />
            </button>
            <button onClick={nextMes} className="w-8 h-8 flex items-center justify-center border transition-colors hover:border-amber-400" style={{ borderColor: "#C9A84C30", color: "#C9A84C80" }}>
              <IconChevronRight />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-7 mb-2">
            {DIAS.map(d => (
              <div key={d} className="text-center text-xs uppercase tracking-widest py-2 font-semibold" style={{ color: "#C9A84C60" }}>
                {d}
              </div>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-600 text-sm">Cargando citas...</div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {celdas.map((dia, i) => {
                if (!dia) return <div key={`empty-${i}`} />
                const citasDia    = citasDelDia(dia)
                const tienesCitas = citasDia.length > 0
                const seleccionado = diaSeleccionado === dia
                const hoyBool     = esHoy(dia)

                return (
                  <button
                    key={dia}
                    onClick={() => setDia(seleccionado ? null : dia)}
                    className="relative flex flex-col items-center justify-start py-2 px-1 min-h-[60px] transition-all"
                    style={{
                      backgroundColor: seleccionado ? "#C9A84C15" : "transparent",
                      border: seleccionado ? "1px solid #C9A84C60" : hoyBool ? "1px solid #C9A84C40" : "1px solid transparent",
                    }}
                  >
                    <span
                      className="text-sm font-semibold w-7 h-7 flex items-center justify-center"
                      style={{
                        color:           hoyBool ? "#0a0a0a" : seleccionado ? "#C9A84C" : "#9ca3af",
                        backgroundColor: hoyBool ? "#C9A84C" : "transparent",
                        borderRadius:    hoyBool ? "50%" : "0",
                      }}
                    >
                      {dia}
                    </span>
                    {tienesCitas && (
                      <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                        {citasDia.slice(0, 3).map((_, idx) => (
                          <div key={idx} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#C9A84C" }} />
                        ))}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="px-6 pb-5 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#C9A84C" }} />
            <span className="text-xs text-gray-600">Citas agendadas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "#C9A84C", color: "#0a0a0a" }}>
              {hoy.getDate()}
            </div>
            <span className="text-xs text-gray-600">Hoy</span>
          </div>
        </div>
      </div>

      {/* Panel lateral: detalle del día */}
      <div className="border" style={{ backgroundColor: "#0f0f0f", borderColor: "#C9A84C20" }}>
        <div className="px-6 py-5 border-b" style={{ borderColor: "#C9A84C20" }}>
          <h3 className="text-white font-bold text-sm">
            {diaSeleccionado ? `${diaSeleccionado} de ${MESES[mes]}` : "Seleccioná un día"}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "#C9A84C60" }}>
            {diaSeleccionado
              ? `${citasSeleccionadas.length} cita${citasSeleccionadas.length !== 1 ? "s" : ""}`
              : "para ver las citas"}
          </p>
        </div>

        <div className="p-4 space-y-3 overflow-y-auto" style={{ maxHeight: "420px" }}>
          {!diaSeleccionado && (
            <div className="text-center py-12">
              <div className="text-4xl mb-3 opacity-20">📅</div>
              <p className="text-gray-600 text-xs">Hacé clic en una fecha del calendario</p>
            </div>
          )}

          {diaSeleccionado && citasSeleccionadas.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-3 opacity-20">✓</div>
              <p className="text-gray-600 text-xs">Sin citas para este día</p>
            </div>
          )}

          {citasSeleccionadas.map((cita) => {
            const colores = colorEstado(cita.estado)
            return (
              <div key={cita.id} className="p-4 border" style={{ backgroundColor: "#0a0a0a", borderColor: "#C9A84C20" }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <IconClock />
                    <span className="text-xs font-semibold" style={{ color: "#C9A84C" }}>{cita.hora}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 uppercase tracking-wide" style={{ backgroundColor: colores.bg, color: colores.color, border: `1px solid ${colores.border}` }}>
                    {cita.estado}
                  </span>
                </div>

                <div className="font-semibold text-white text-sm">{cita.cliente}</div>
                <div className="text-xs mt-0.5 mb-4" style={{ color: "#C9A84C60" }}>{cita.name}</div>

                {/* Acciones */}
                <div className="flex gap-2">
                  {cita.estado === "pendiente" && (
                    <button
                      onClick={() => actualizarEstado(cita.id, "confirmada")}
                      className="flex-1 text-xs py-1.5 font-semibold uppercase tracking-wide transition-colors"
                      style={{ backgroundColor: "#C9A84C20", color: "#C9A84C", border: "1px solid #C9A84C40" }}
                    >
                      Confirmar
                    </button>
                  )}
                  <button
                    onClick={() => eliminarCita(cita.id)}
                    className="flex-1 text-xs py-1.5 font-semibold uppercase tracking-wide transition-colors"
                    style={{ backgroundColor: "#ff000010", color: "#ef4444", border: "1px solid #ff000030" }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
    </>
  )
}

// ── VISTA INICIO ──────────────────────────────────────────────────
function InicioView({ user, citas, loading }) {
  const proximas = citas
    .filter(c => new Date(c.date) >= new Date() && c.estado !== "cancelada")
    .slice(0, 4)

  const pendientes = citas.filter(c => c.estado === "pendiente").length

  const statsValores = { pendientes, clientes: "—", casos: "—" }

  return (
    <>
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
        {statsBase.map((stat) => (
          <div key={stat.label} className="p-8 flex items-center gap-5" style={{ backgroundColor: "#0f0f0f" }}>
            <div className="w-12 h-12 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#C9A84C15", color: "#C9A84C", border: "1px solid #C9A84C30" }}>
              <stat.Icon />
            </div>
            <div>
              <div className="text-3xl font-bold text-white">{statsValores[stat.key]}</div>
              <div className="text-xs uppercase tracking-widest mt-1" style={{ color: "#C9A84C80" }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Próximas citas */}
      <div className="border" style={{ backgroundColor: "#0f0f0f", borderColor: "#C9A84C20" }}>
        <div className="px-8 py-5 border-b flex items-center justify-between" style={{ borderColor: "#C9A84C20" }}>
          <div className="flex items-center gap-3">
            <span style={{ color: "#C9A84C" }}><IconCalendar /></span>
            <h2 className="text-white font-bold">Próximas citas</h2>
          </div>
          <span className="text-xs uppercase tracking-widest px-3 py-1 border" style={{ color: "#C9A84C", borderColor: "#C9A84C30" }}>
            {proximas.length} agendadas
          </span>
        </div>

        {loading ? (
          <div className="px-8 py-10 text-center text-gray-600 text-sm">Cargando...</div>
        ) : proximas.length === 0 ? (
          <div className="px-8 py-10 text-center text-gray-600 text-sm">Sin citas próximas</div>
        ) : (
          <div className="divide-y" style={{ borderColor: "#C9A84C10" }}>
            {proximas.map((cita) => {
              const fecha   = new Date(cita.date)
              const cliente = `${cita.client_name} ${cita.client_surname}`
              return (
                <div key={cita.id} className="px-8 py-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: "#C9A84C10", color: "#C9A84C", border: "1px solid #C9A84C20" }}>
                      {cliente.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-white text-sm font-semibold">{cliente}</div>
                      <div className="text-xs mt-0.5" style={{ color: "#C9A84C60" }}>{cita.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-gray-500 text-xs">
                      {fecha.getDate()}/{fecha.getMonth()+1} — {fecha.toTimeString().slice(0,5)}
                    </span>
                    <span
                      className="text-xs px-3 py-1 uppercase tracking-widest"
                      style={{
                        backgroundColor: cita.estado === "confirmada" ? "#C9A84C15" : "#ffffff08",
                        color:           cita.estado === "confirmada" ? "#C9A84C"   : "#6b7280",
                        border:          `1px solid ${cita.estado === "confirmada" ? "#C9A84C30" : "#ffffff10"}`,
                      }}
                    >
                      {cita.estado}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

// ── MODAL NUEVO CLIENTE ───────────────────────────────────────────
function ModalNuevoCliente({ onClose, onGuardar }) {
  const [form, setForm]       = useState({ name: "", lastname: "", email: "" })
  const [guardando, setGuardando] = useState(false)
  const [error, setError]     = useState(null)

  const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setError(null)
    try {
      await onGuardar(form)
      onClose()
    } catch {
      setError("No se pudo crear el cliente. Revisá los datos.")
    } finally {
      setGuardando(false)
    }
  }

  const inputStyle = { backgroundColor: "#0a0a0a", border: "1px solid #C9A84C30", color: "#e5e7eb" }
  const labelStyle = { color: "#C9A84C80", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
      <div className="w-full max-w-md border" style={{ backgroundColor: "#0f0f0f", borderColor: "#C9A84C30" }}>

        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "#C9A84C20" }}>
          <div className="flex items-center gap-3">
            <span style={{ color: "#C9A84C" }}><IconUsers size={18} /></span>
            <h3 className="text-white font-bold">Nuevo Cliente</h3>
          </div>
          <button onClick={onClose} style={{ color: "#6b7280" }} onMouseEnter={e => e.currentTarget.style.color = "#C9A84C"} onMouseLeave={e => e.currentTarget.style.color = "#6b7280"}>
            <IconX />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label style={labelStyle}>Nombre</label>
            <input name="name" value={form.name} onChange={onChange} required placeholder="Juan" className="w-full mt-1 px-3 py-2.5 text-sm outline-none" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Apellido</label>
            <input name="lastname" value={form.lastname} onChange={onChange} required placeholder="Pérez" className="w-full mt-1 px-3 py-2.5 text-sm outline-none" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input name="email" type="email" value={form.email} onChange={onChange} required placeholder="juan@mail.com" className="w-full mt-1 px-3 py-2.5 text-sm outline-none" style={inputStyle} />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-semibold border transition-colors" style={{ borderColor: "#C9A84C30", color: "#6b7280" }}>
              Cancelar
            </button>
            <button type="submit" disabled={guardando} className="flex-1 py-3 text-sm font-bold uppercase tracking-widest" style={{ backgroundColor: "#C9A84C", color: "#0a0a0a", opacity: guardando ? 0.6 : 1 }}>
              {guardando ? "Guardando..." : "Crear cliente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── VISTA CLIENTES ────────────────────────────────────────────────
function ClientesView() {
  const clientes      = clienteStore(state => state.clientes)
  const loading       = clienteStore(state => state.loading)
  const getClientes   = clienteStore(state => state.getClientes)
  const postCliente   = clienteStore(state => state.postCliente)
  const deleteCliente = clienteStore(state => state.deleteCliente)

  const [modalAbierto, setModal] = useState(false)

  useEffect(() => { getClientes() }, [])

  return (
    <>
      {modalAbierto && <ModalNuevoCliente onClose={() => setModal(false)} onGuardar={postCliente} />}

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-px w-8" style={{ backgroundColor: "#C9A84C" }} />
          <span className="text-xs uppercase tracking-[0.3em]" style={{ color: "#C9A84C" }}>Gestión</span>
        </div>
        <h1 className="text-3xl font-bold text-white">Clientes</h1>
        <p className="text-gray-500 text-sm mt-1">Listado de clientes registrados</p>
      </div>

      <div className="border" style={{ backgroundColor: "#0f0f0f", borderColor: "#C9A84C20" }}>
        <div className="px-8 py-5 border-b flex items-center gap-3" style={{ borderColor: "#C9A84C20" }}>
          <span style={{ color: "#C9A84C" }}><IconUsers /></span>
          <h2 className="text-white font-bold">Clientes</h2>
          <span className="ml-auto text-xs uppercase tracking-widest px-3 py-1 border" style={{ color: "#C9A84C", borderColor: "#C9A84C30" }}>
            {clientes.length} registros
          </span>
          <button
            onClick={() => setModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-widest"
            style={{ backgroundColor: "#C9A84C", color: "#0a0a0a" }}
          >
            <IconPlus size={14} /> Nuevo cliente
          </button>
        </div>

        {loading ? (
          <div className="px-8 py-10 text-center text-gray-600 text-sm">Cargando...</div>
        ) : clientes.length === 0 ? (
          <div className="px-8 py-10 text-center text-gray-600 text-sm">Sin clientes registrados</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid #C9A84C15" }}>
                {["Nombre", "Apellido", "Email", ""].map((col, i) => (
                  <th key={i} className="px-8 py-4 text-left text-xs uppercase tracking-widest font-semibold" style={{ color: "#C9A84C60" }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clientes.map((c, i) => (
                <tr
                  key={c.id ?? i}
                  style={{ borderBottom: "1px solid #C9A84C10" }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#C9A84C08"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <td className="px-8 py-4 text-white font-medium">{c.name}</td>
                  <td className="px-8 py-4 text-gray-400">{c.lastname}</td>
                  <td className="px-8 py-4" style={{ color: "#C9A84C80" }}>{c.email}</td>
                  <td className="px-8 py-4 text-right">
                    <button
                      onClick={() => deleteCliente(c.id)}
                      className="text-xs px-3 py-1.5 uppercase tracking-wide font-semibold"
                      style={{ backgroundColor: "#ff000010", color: "#ef4444", border: "1px solid #ff000030" }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}

// ── NAV ITEMS ─────────────────────────────────────────────────────
const navItems = [
  { id: "inicio",      label: "Inicio",      Icon: IconHome     },
  { id: "calendario",  label: "Calendario",  Icon: IconCalendar },
  { id: "clientes",    label: "Clientes",    Icon: IconUsers    },
  { id: "casos",       label: "Casos",       Icon: IconFolder   },
]

// ── DASHBOARD PAGE ────────────────────────────────────────────────
export default function DashboardPage() {
  const router  = useRouter()
  const user    = useAuthStore((state) => state.user)
  const token   = useAuthStore((state) => state.token)
  const logout  = useAuthStore((state) => state.logout)
  const [vista, setVista] = useState("inicio")

  const { citas, loading, crearCita, eliminarCita, actualizarEstado } = useCitas(token)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#0a0a0a" }}>

      {/* ── SIDEBAR ───────────────────────────────────────────────── */}
      <aside className="w-64 flex-shrink-0 flex flex-col border-r" style={{ backgroundColor: "#0d0d0d", borderColor: "#C9A84C20" }}>

        {/* Logo */}
        <div className="px-6 py-6 border-b" style={{ borderColor: "#C9A84C20" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#C9A84C" }}>
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="#0a0a0a" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7l-9-5z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div>
              <span className="text-white font-bold text-sm">Estudio Jurídico</span>
              <span className="block text-xs uppercase tracking-widest" style={{ color: "#C9A84C60" }}>Admin</span>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map(({ id, label, Icon }) => {
            const activo = vista === id
            return (
              <button
                key={id}
                onClick={() => setVista(id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all text-left"
                style={{
                  backgroundColor: activo ? "#C9A84C15" : "transparent",
                  color:           activo ? "#C9A84C"   : "#6b7280",
                  borderLeft:      activo ? "2px solid #C9A84C" : "2px solid transparent",
                }}
              >
                <Icon size={18} />
                {label}
              </button>
            )
          })}
        </nav>

        {/* Usuario + logout */}
        <div className="px-3 py-4 border-t space-y-2" style={{ borderColor: "#C9A84C20" }}>
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: "#C9A84C20", color: "#C9A84C", border: "1px solid #C9A84C40" }}>
              {user ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}` : "AD"}
            </div>
            <div className="min-w-0">
              <div className="text-white text-xs font-semibold truncate">
                {user ? `${user.first_name} ${user.last_name}` : "Administrador"}
              </div>
              <div className="text-xs truncate" style={{ color: "#C9A84C60" }}>{user?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
            style={{ color: "#6b7280" }}
            onMouseEnter={e => e.currentTarget.style.color = "#C9A84C"}
            onMouseLeave={e => e.currentTarget.style.color = "#6b7280"}
          >
            <IconLogout />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── CONTENIDO PRINCIPAL ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="border-b px-8 py-4 flex items-center justify-between flex-shrink-0" style={{ borderColor: "#C9A84C20", backgroundColor: "#0d0d0d" }}>
          <div>
            <h2 className="text-white font-bold capitalize">
              {navItems.find(n => n.id === vista)?.label}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "#C9A84C60" }}>
              Panel de administración
            </p>
          </div>
        </header>

        {/* Vista activa */}
        <main className="flex-1 px-8 py-10 overflow-y-auto">
          {vista === "inicio"     && <InicioView user={user} citas={citas} loading={loading} />}
          {vista === "calendario" && <CalendarioView citas={citas} loading={loading} crearCita={crearCita} eliminarCita={eliminarCita} actualizarEstado={actualizarEstado} />}
          {vista === "clientes"   && <ClientesView />}
          {vista === "casos"      && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4 opacity-20">📁</div>
              <p className="text-gray-500 text-sm">Módulo de casos próximamente</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
