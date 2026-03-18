"use client"

import { useState, useEffect } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const inputStyle = {
  borderColor: "#C9A84C30",
  backgroundColor: "#0a0a0a",
  color: "#e5e7eb",
}

export default function FormCita() {
  const [form, setForm] = useState({
    client_name: "", client_surname: "", phone_number: "",
    client_email: "", name: "", tipo: "", date: "", hora: "",
  })
  const [slots, setSlots]               = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [enviando, setEnviando]         = useState(false)
  const [exito, setExito]               = useState(false)
  const [error, setError]               = useState(null)

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
    setEnviando(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/citas/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name:    form.client_name,
          client_surname: form.client_surname,
          phone_number:   form.phone_number,
          client_email:   form.client_email,
          name:           form.name || "Consulta jurídica",
          tipo:           form.tipo || "civil",
          date:           `${form.date}T${form.hora}:00`,
          estado:         "pendiente",
        }),
      })
      if (res.status === 409) throw new Error("Este horario ya fue reservado. Elegí otro.")
      if (!res.ok) throw new Error("Error al enviar la solicitud")
      setExito(true)
      setForm({ client_name: "", client_surname: "", phone_number: "", name: "", tipo: "", date: "", hora: "" })
      setSlots([])
    } catch {
      setError("No se pudo registrar la cita. Intentá nuevamente.")
    } finally {
      setEnviando(false)
    }
  }

  if (exito) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">✓</div>
        <h4 className="text-white font-bold text-lg mb-2">¡Solicitud enviada!</h4>
        <p className="text-gray-500 text-sm mb-6">Nos pondremos en contacto para confirmar tu cita.</p>
        <button onClick={() => setExito(false)} className="text-xs uppercase tracking-widest px-6 py-2 border" style={{ borderColor: "#C9A84C40", color: "#C9A84C" }}>
          Agendar otra cita
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#C9A84C80" }}>Nombre</label>
          <input type="text" name="client_name" value={form.client_name} onChange={onChange} required placeholder="Tu nombre" className="w-full border px-4 py-3 text-sm placeholder-gray-700 outline-none" style={inputStyle} />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#C9A84C80" }}>Apellido</label>
          <input type="text" name="client_surname" value={form.client_surname} onChange={onChange} required placeholder="Tu apellido" className="w-full border px-4 py-3 text-sm placeholder-gray-700 outline-none" style={inputStyle} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#C9A84C80" }}>Teléfono</label>
          <input type="tel" name="phone_number" value={form.phone_number} onChange={onChange} placeholder="+54 11 1234-5678" className="w-full border px-4 py-3 text-sm placeholder-gray-700 outline-none" style={inputStyle} />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#C9A84C80" }}>Email</label>
          <input type="email" name="client_email" value={form.client_email} onChange={onChange} required placeholder="tu@email.com" className="w-full border px-4 py-3 text-sm placeholder-gray-700 outline-none" style={inputStyle} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#C9A84C80" }}>Tipo de consulta</label>
        <select name="tipo" value={form.tipo} onChange={onChange} className="w-full border px-4 py-3 text-sm outline-none" style={inputStyle}>
          <option value="">Seleccioná un área</option>
          <option value="civil">Derecho Civil</option>
          <option value="comercial">Derecho Comercial</option>
          <option value="familia">Derecho de Familia</option>
          <option value="inmobiliario">Derecho Inmobiliario</option>
          <option value="laboral">Derecho Laboral</option>
          <option value="penal">Derecho Penal</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#C9A84C80" }}>Motivo de la consulta</label>
        <input type="text" name="name" value={form.name} onChange={onChange} placeholder="Ej: Consulta por contrato de alquiler" className="w-full border px-4 py-3 text-sm placeholder-gray-700 outline-none" style={inputStyle} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#C9A84C80" }}>Fecha</label>
          <input type="date" name="date" value={form.date} onChange={onChange} required className="w-full border px-4 py-3 text-sm outline-none" style={inputStyle} />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#C9A84C80" }}>Horario</label>
          <select name="hora" value={form.hora} onChange={onChange} required disabled={!form.date || loadingSlots} className="w-full border px-4 py-3 text-sm outline-none" style={{ ...inputStyle, opacity: (!form.date || loadingSlots) ? 0.5 : 1 }}>
            <option value="">
              {!form.date ? "Elegí una fecha primero" : loadingSlots ? "Cargando..." : slots.length === 0 ? "Sin horarios disponibles" : "Seleccioná un horario"}
            </option>
            {slots.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <button type="submit" disabled={enviando} className="w-full py-4 font-semibold text-sm uppercase tracking-widest transition-all mt-2" style={{ backgroundColor: "#C9A84C", color: "#0a0a0a", opacity: enviando ? 0.7 : 1 }}>
        {enviando ? "Enviando..." : "Confirmar Cita"}
      </button>
    </form>
  )
}
