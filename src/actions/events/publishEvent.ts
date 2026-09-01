"use server"
import { EventCreateData } from "@/zod/schemas";
import { getToken } from "../utility/getToken";
import { API_URLS, cfg } from "@/cfg";
import { ERR_UNAUTHORIZED } from "@/constants";
import { api } from "@/utils/http/api";
import { ApiResponse, EVENTS } from "@/types";
import { ErrorResponse } from "../utility/ErrorResponse";

export const publishEvent = async (data: EventCreateData): Promise<ApiResponse<EVENTS | null>> => {
    
    try {
        const token = await getToken(cfg.COOKIE_KEY)
        if(!token){
            return ERR_UNAUTHORIZED
        }
        const response = await api<EVENTS>(
            API_URLS.PUBLISH_EVENTS,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: data
            }
        )
        return response
    } catch (error) {
        return ErrorResponse(error)
    }
}