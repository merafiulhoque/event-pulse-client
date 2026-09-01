"use server"

import { API_URLS } from "@/cfg";
import { api } from "@/utils/http/api";

export async function checkAvailability(id: number){
    const response = await api<number | null>(
            API_URLS.CHECK_AVAILABILITY(id),
        )
        return response
}