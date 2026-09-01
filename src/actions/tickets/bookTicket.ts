"use server"

import { API_URLS } from "@/cfg";
import { Ticket } from "@/types";
import { api } from "@/utils/http/api";
import { ticketBookingData } from "@/zod/schemas";

export async function bookTicket(eventId: number, data: ticketBookingData, idempotencyKey: string){
    const response = await api<Ticket | null>(
        API_URLS.BOOK_TICKET(eventId),
        {
            method: "POST",
            headers: {
                "Idempotency-Key": idempotencyKey
            },
            body: data
        }
    )
    return response
}