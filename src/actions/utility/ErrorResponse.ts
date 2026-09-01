import { ApiResponse } from "@/types";

export function ErrorResponse(err: any): ApiResponse<null>{
    return {
        success: false,
        message: err instanceof Error ? err.message : "Something Went Wrong"
    }
}