import { create } from "zustand";
import axios from "axios";
import { persist, devtools } from "zustand/middleware";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const config = {
    headers: {
        "Content-Type": "application/json",
        accept: "application/json",
    }
}

export const clienteStore = create(
    devtools(
        persist(
            (set) => ({

                // ESTADOS
                clientes: [],
                loading: false,
                error: null,

                getClientes: async () => {
                    try {
                        set({ loading: true, error: null })
                        const res = await axios.get(`${API_URL}/cliente/clientes/`, config)
                        set({ clientes: res.data.message ?? res.data, loading: false })
                    } catch (error) {
                        set({ error: error.response?.data, loading: false })
                    }
                },

                postCliente: async (data) => {
                    try {
                        set({ loading: true, error: null })
                        const res = await axios.post(`${API_URL}/cliente/clientes/`, data, config)
                        set(state => ({
                            clientes: [...state.clientes, res.data],
                            loading: false,
                        }))
                        return res.data
                    } catch (error) {
                        set({ error: error.response?.data, loading: false })
                        throw error
                    }
                },

                deleteCliente: async (id) => {
                    try {
                        set({ loading: true, error: null })
                        await axios.delete(`${API_URL}/cliente/clientes/${id}/`, config)
                        set(state => ({
                            clientes: state.clientes.filter(c => c.id !== id),
                            loading: false,
                        }))
                    } catch (error) {
                        set({ error: error.response?.data, loading: false })
                        throw error
                    }
                },
            }),
            { name: "cliente-storage" }
        )
    )
)
