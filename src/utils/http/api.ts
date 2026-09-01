import { ApiResponse, RequestOptions } from "@/types";

export async function api<T>(
    url: string,
    {
        method = "GET",
        body,
        credentials = "omit",
        headers = {}
    }: RequestOptions = {}
) : Promise<ApiResponse<T>>{
    try {
    const res = await fetch(url, {
        method,
        credentials,
        headers: {
        "Content-Type": "application/json",
        ...headers,
        },
        ...(body !== undefined && method !== "GET"
        ? { body: JSON.stringify(body) }
        : {}),
    });
    const responseData: ApiResponse<T> = await res.json()
    return responseData
  } catch (error) {
    return {
        success: false,
        message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}