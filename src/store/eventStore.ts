import { EVENTS } from "@/types"
import { create } from "zustand"
import { persist } from "zustand/middleware"

type EventState = {
    events: EVENTS[] | null
    setEvents: (events: EVENTS[] | null) => void
    addEvent: (event: EVENTS) => void
    getEventDetails: (id: number) => EVENTS | undefined
    clearEvents: () => void
}

export const useEventStore = create<EventState>()(
    persist(
        (set, get) => ({
            events: null,
            setEvents: (events: EVENTS[] | null) => set({ events }),
            addEvent: (event: EVENTS) => 
                set((state) => ({
                    events: state.events ? [...state.events, event] : [event]
                })),
            getEventDetails: (id: number) => {
                const events = get().events
                if (!events) return undefined
                return events.find(event => event.id === id)
            },
            clearEvents: () => set({ events: null }),
        }),
        {
            name: "event-store",
        }
    )
)