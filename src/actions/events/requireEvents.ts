"use server"

import { API_URLS, cfg } from "@/cfg";
import { getToken } from "../utility/getToken";
import { ERR_UNAUTHORIZED } from "@/constants";
import { api } from "@/utils/http/api";
import { EVENTS } from "@/types";
import { ErrorResponse } from "../utility/ErrorResponse";

export async function requireEvents(){
    try {
        const token = await getToken(cfg.COOKIE_KEY)

        if (!token) return ERR_UNAUTHORIZED

        const eventsResponse = await api<EVENTS[]>(
            API_URLS.GET_EVENTS,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        return eventsResponse
    } catch (error) {
        return ErrorResponse(error)
    }
}