"use client";

import { useState } from "react";
import { IconScales, IconPaperclip, IconSend, IconChat, IconClose } from "@/components/Icons";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-6 w-80 h-[480px] rounded-none shadow-2xl flex flex-col z-50 overflow-hidden" style={{ backgroundColor: "#111111", border: "1px solid rgba(201,168,76,0.25)" }}>
          {/* Header */}
          <div className="px-5 py-4 flex items-center justify-between flex-shrink-0" style={{ backgroundColor: "#0a0a0a", borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#C9A84C" }}>
                <IconScales size={16} color="#0a0a0a" />
              </div>
              <div>
                <div className="font-semibold text-sm text-white" style={{ fontFamily: "var(--font-playfair)" }}>Asistente Legal</div>
                <div className="text-xs flex items-center gap-1.5" style={{ color: "#C9A84C" }}>
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: "#C9A84C" }} />
                  En línea
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="transition-colors" style={{ color: "#6b7280" }}>
              <IconClose size={18} />
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
            <div className="flex items-start gap-2">
              <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: "#C9A84C20", border: "1px solid #C9A84C40" }}>
                <IconScales size={13} color="#C9A84C" />
              </div>
              <div className="text-sm rounded-none px-4 py-2.5 max-w-[80%] leading-relaxed" style={{ backgroundColor: "#1a1a1a", color: "#d1d5db", border: "1px solid rgba(201,168,76,0.1)" }}>
                Hola, soy tu asistente legal. ¿En qué puedo ayudarte hoy?
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="px-3 py-3 flex items-center gap-2 flex-shrink-0" style={{ backgroundColor: "#0a0a0a", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
            <button className="p-1.5 transition-colors" style={{ color: "#6b7280" }} title="Subir PDF">
              <IconPaperclip size={18} />
            </button>
            <input
              type="text"
              placeholder="Escribe tu consulta..."
              className="flex-1 text-sm px-4 py-2 outline-none transition-colors"
              style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(201,168,76,0.2)", color: "#d1d5db" }}
            />
            <button className="w-8 h-8 flex items-center justify-center flex-shrink-0 transition-colors" style={{ backgroundColor: "#C9A84C" }}>
              <IconSend size={14} color="#0a0a0a" />
            </button>
          </div>
        </div>
      )}

      {/* Botón flotante */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 shadow-lg transition-all hover:scale-110 z-50 flex items-center justify-center"
        style={{ backgroundColor: "#C9A84C" }}
        title="Abrir asistente legal"
      >
        {open
          ? <IconClose size={22} color="#0a0a0a" />
          : <IconChat size={22} color="#0a0a0a" />
        }
      </button>
    </>
  );
}
