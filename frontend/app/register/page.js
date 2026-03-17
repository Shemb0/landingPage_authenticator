import Link from "next/link";




export const metadata = {
  title: "Registro Administrador | Estudio Jurídico",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-12">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400 opacity-5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-400 opacity-5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-400 rounded-2xl mb-4">
            <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9 text-zinc-950" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7l-9-5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-white text-2xl font-bold">Estudio Jurídico</h1>
          <p className="text-gray-500 text-sm mt-1">Registro de Administrador</p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-1">Crear cuenta</h2>
          <p className="text-gray-500 text-sm mb-8">Solo para administradores autorizados</p>

          <form className="space-y-5">
            {/* Nombre y Apellido */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Nombre</label>
                <input
                  type="text"
                  placeholder="Juan"
                  className="w-full bg-zinc-950 border border-zinc-700 text-gray-200 placeholder-zinc-600 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Apellido</label>
                <input
                  type="text"
                  placeholder="García"
                  className="w-full bg-zinc-950 border border-zinc-700 text-gray-200 placeholder-zinc-600 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Correo electrónico</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg></span>
                <input
                  type="email"
                  placeholder="admin@estudiojuridico.com"
                  className="w-full bg-zinc-950 border border-zinc-700 text-gray-200 placeholder-zinc-600 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Contraseña</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-zinc-950 border border-zinc-700 text-gray-200 placeholder-zinc-600 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-amber-400 transition-colors"
                />
              </div>
              <p className="text-xs text-gray-600 mt-1.5">Mínimo 8 caracteres</p>
            </div>

            {/* Confirmar password */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Confirmar contraseña</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-zinc-950 border border-zinc-700 text-gray-200 placeholder-zinc-600 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            {/* Términos */}
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-amber-400 rounded mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-500 leading-relaxed">
                Acepto los{" "}
                <span className="text-amber-400 font-medium hover:underline cursor-pointer">términos y condiciones</span>{" "}
                de uso del panel de administración
              </span>
            </label>

            {/* Botón */}
            <button
              type="submit"
              className="w-full bg-amber-400 text-zinc-950 py-3.5 rounded-xl font-bold hover:bg-amber-300 transition-colors tracking-wide"
            >
              Crear cuenta
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-xs text-gray-600">¿Ya tenés cuenta?</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          <Link
            href="/login"
            className="block w-full text-center border border-zinc-700 text-gray-400 py-3 rounded-xl font-semibold hover:border-amber-400 hover:text-amber-400 transition-colors text-sm"
          >
            Iniciar sesión
          </Link>
        </div>

        {/* Volver */}
        <div className="text-center mt-6">
          <Link href="/" className="text-gray-600 hover:text-amber-400 text-sm transition-colors">
            ← Volver al sitio
          </Link>
        </div>
      </div>
    </div>
  );
}
