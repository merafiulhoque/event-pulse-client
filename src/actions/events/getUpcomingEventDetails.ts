"use server"

import { API_URLS } from "@/cfg"
import { EVENTS } from "@/types"
import { api } from "@/utils/http/api"
import { ErrorResponse } from "../utility/ErrorResponse"

export const getUpcomingEventDetails = async () => {
    try {
        const resData = await api<EVENTS[]>(
            API_URLS.UPCOMING_EVENTS,
        )
        return resData
    } catch (error) {
        return ErrorResponse(error)
    }
}