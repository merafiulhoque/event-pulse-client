"use server"

import { API_URLS, cfg } from "@/cfg";
import { ApiResponse } from "@/types";
import { api } from "@/utils/http/api";
import { OrganizerLoginData } from "@/zod/schemas";
import { cookies } from "next/headers";

export async function organizerLogin(loginData: OrganizerLoginData): Promise<ApiResponse<null>>{
    try {
        const res: ApiResponse<string | null> = await api<string>(
            API_URLS.LOGIN, {
                method: "POST",
                body: loginData
            }
        )

        const {data, ...response} = res

        if (!response.success){
            return response
        }

        if (!data || typeof data !== "string"){
            return response
        }

        

        const cookieStore = await cookies()

        cookieStore
            .set(
                cfg.COOKIE_KEY,
                data,
                {
                    httpOnly: true,
                    secure: cfg.NODE_ENV === "production",
                    path: "/",
                    sameSite: "lax",
                    maxAge: 60*60
                }
            )
        return response
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Network Error"
        }
    }
}