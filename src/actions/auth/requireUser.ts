"use server"

import { API_URLS, cfg } from "@/cfg";
import { JWT_PAYLOAD } from "@/types";
import { api } from "@/utils/http/api";
import { getToken } from "../utility/getToken";
import { ERR_UNAUTHORIZED } from "@/constants";

export async function requireUser(){
    try {
        const token = await getToken(cfg.COOKIE_KEY)
        if (!token) return ERR_UNAUTHORIZED
        const response = await api<JWT_PAYLOAD | null>(
            API_URLS.ME,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        return response
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Something went wrong"
        }
    }
}