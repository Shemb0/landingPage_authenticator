import { create } from "zustand"
import axios from "axios"
import { devtools, persist } from "zustand/middleware"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const config = {
  headers: {
    accept: "application/json",
    "Content-Type": "application/json",
  },
}

export const useAuthStore = create(
  devtools(
    persist(
      (set) => ({

        // ── ESTADO INICIAL ─────────────────────────────────────────
        user:            null,   // datos del usuario
        token:           null,   // JWT access token (expira en 8h según tu config)
        refresh:         null,   // JWT refresh token (expira en 7 días)
        isAuthenticated: false,  // true cuando hay sesión activa
        loading:         false,
        error:           null,
        registered:      false,


        // ── REGISTRO ───────────────────────────────────────────────
        signUp: async (email, first_name, last_name, password, re_password) => {

          set({ loading: true, error: null })

          const body = { email, first_name, last_name, password, re_password }

          try {
            const res = await axios.post(`${API_URL}/auth/users/`, body, config)

            if (res.status === 201) {
              set({ registered: true, loading: false })
            }

          } catch (error) {
            set({ error: error.response?.data, loading: false })
          }
        },


        // ── LOGIN ──────────────────────────────────────────────────
        login: async (email, password) => {

          set({ loading: true, error: null })

          const body = { email, password }

          try {
            const res = await axios.post(`${API_URL}/auth/jwt/create/`, body, config)

            if (res.status === 200) {
              // Guardamos access y refresh en el estado
              // persist los va a guardar en localStorage automáticamente
              set({
                token:           res.data.access,
                refresh:         res.data.refresh,
                isAuthenticated: true,
              })
              await useAuthStore.getState().getMe()
            }

          } catch (error) {
            set({ error: error.response?.data, loading: false })
          }
        },


        // ── RENOVAR TOKEN ──────────────────────────────────────────
        //
        //  Cuando el access token expira (8h), usamos el refresh para
        //  pedir uno nuevo sin que el usuario tenga que hacer login de nuevo
        //
        refreshToken: async () => {

          const refresh = useAuthStore.getState().refresh

          // Si no hay refresh token no podemos renovar → logout
          if (!refresh) {
            useAuthStore.getState().logout()
            return
          }

          try {
            const res = await axios.post(`${API_URL}/auth/jwt/refresh/`, { refresh }, config)

            if (res.status === 200) {
              set({ token: res.data.access, isAuthenticated: true })
            }

          } catch (error) {
            // Si el refresh también expiró → cerramos sesión
            useAuthStore.getState().logout()
          }
        },


        // ── DATOS DEL USUARIO ──────────────────────────────────────
        getMe: async () => {

          set({ loading: true })

          const token = useAuthStore.getState().token

          try {
            const res = await axios.get(`${API_URL}/auth/users/me/`, {
              headers: {
                ...config.headers,
                Authorization: `JWT ${token}`,
              },
            })

            set({ user: res.data, loading: false })

          } catch (error) {
            set({ error: error.response?.data, loading: false })
          }
        },


        // ── ACTIVACIÓN ─────────────────────────────────────────────
        activation: async (uid, token) => {

          set({ loading: true })

          const body = { uid, token }

          try {
            const res = await axios.post(`${API_URL}/auth/users/activation/`, body, config)

            if (res.status === 204) {
              set({ loading: false })
            }

          } catch (error) {
            set({ error: error.response?.data, loading: false })
          }
        },


        // ── LOGOUT ─────────────────────────────────────────────────
        //
        //  Limpia el estado y localStorage (persist lo maneja solo)
        //
        logout: () => {
          set({
            user:            null,
            token:           null,
            refresh:         null,
            isAuthenticated: false,
            error:           null,
            registered:      false,
          })
        },

      }),
      {
        name: "auth",                          // key en localStorage
        partialize: (state) => ({              // solo guardamos lo necesario
          token:           state.token,
          refresh:         state.refresh,
          isAuthenticated: state.isAuthenticated,
          user:            state.user,
        }),
      }
    ),
    { name: "AuthStore" }
  )
)
