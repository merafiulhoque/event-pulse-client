"use server"

import { cfg } from "@/cfg";
import { ApiResponse } from "@/types";
import { cookies } from "next/headers";

export async function signout(): Promise<ApiResponse<null>>{
    const cookieStore = await cookies()
    cookieStore.delete(cfg.COOKIE_KEY)
    
    return {
        success: true,
        message: "Logout successfull"
    }
}