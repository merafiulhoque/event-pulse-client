import { JWT_PAYLOAD } from "@/types"
import { create } from "zustand"
import { persist } from "zustand/middleware"

type AuthState = {
    user: JWT_PAYLOAD | null
    setUser: (user: JWT_PAYLOAD | null) => void
    clearUser: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            clearUser: () => {
                // Completely wipe the persisted storage item from browser localStorage
                if (typeof window !== "undefined") {
                    localStorage.removeItem("organizer-auth");
                }
                set({ user: null });
            },
        }),
        {
            name: "organizer-auth",
        }
    )
)