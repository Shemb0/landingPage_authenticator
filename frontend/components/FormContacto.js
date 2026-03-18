"use client"

import { useState } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const inputStyle = {
  borderColor: "#C9A84C30",
  backgroundColor: "transparent",
  color: "#e5e7eb",
}

export default function FormContacto() {
  const [form, setForm] = useState({
    nombre: "", email: "", telefono: "", asunto: "", mensaje: "",
  })
  const [enviando, setEnviando] = useState(false)
  const [exito, setExito]       = useState(false)
  const [error, setError]       = useState(null)

  const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setEnviando(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/citas/contacto/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setExito(true)
      setForm({ nombre: "", email: "", telefono: "", asunto: "", mensaje: "" })
    } catch {
      setError("No se pudo enviar el mensaje. Intentá nuevamente.")
    } finally {
      setEnviando(false)
    }
  }

  if (exito) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">✓</div>
        <h4 className="text-white font-bold text-lg mb-2">¡Mensaje enviado!</h4>
        <p className="text-gray-500 text-sm mb-6">Te respondemos en menos de 24 hs.</p>
        <button onClick={() => setExito(false)} className="text-xs uppercase tracking-widest px-6 py-2 border" style={{ borderColor: "#C9A84C40", color: "#C9A84C" }}>
          Enviar otro mensaje
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#C9A84C80" }}>Nombre completo</label>
        <input type="text" name="nombre" value={form.nombre} onChange={onChange} required placeholder="Tu nombre completo" className="w-full border px-4 py-3 text-sm placeholder-gray-700 outline-none" style={inputStyle} />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#C9A84C80" }}>Email</label>
        <input type="email" name="email" value={form.email} onChange={onChange} required placeholder="tu@email.com" className="w-full border px-4 py-3 text-sm placeholder-gray-700 outline-none" style={inputStyle} />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#C9A84C80" }}>Teléfono (opcional)</label>
        <input type="tel" name="telefono" value={form.telefono} onChange={onChange} placeholder="+54 11 1234-5678" className="w-full border px-4 py-3 text-sm placeholder-gray-700 outline-none" style={inputStyle} />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#C9A84C80" }}>Asunto</label>
        <input type="text" name="asunto" value={form.asunto} onChange={onChange} required placeholder="¿Sobre qué querés consultarnos?" className="w-full border px-4 py-3 text-sm placeholder-gray-700 outline-none" style={inputStyle} />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#C9A84C80" }}>Mensaje</label>
        <textarea rows={4} name="mensaje" value={form.mensaje} onChange={onChange} required placeholder="Contanos brevemente tu situación..." className="w-full border px-4 py-3 text-sm placeholder-gray-700 outline-none resize-none" style={inputStyle} />
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <button type="submit" disabled={enviando} className="w-full py-4 font-semibold text-sm uppercase tracking-widest border transition-all mt-2 text-white" style={{ borderColor: "#C9A84C", opacity: enviando ? 0.7 : 1 }}>
        {enviando ? "Enviando..." : "Enviar Mensaje"}
      </button>
    </form>
  )
}
