"use server"

import { API_URLS } from "@/cfg";
import { ApiResponse } from "@/types";
import { api } from "@/utils/http/api";
import { OrganizerCreateInput } from "@/zod/schemas";

export async function createAccount(data: OrganizerCreateInput){
    try {
        const response: ApiResponse<null> = await api<null>(
            API_URLS.CREATE_AC,
            {
                method: "POST",
                body: data
            }
        )
        return response
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Network error"
        }
    }
}