const ENV = process.env

const BASE_URL = ENV.BASE_API_URL!

export const cfg = {
    NODE_ENV: ENV.NODE_ENV!,
    COOKIE_KEY: ENV.COOKIE_KEY!
}

export const API_URLS = {
    CREATE_AC: `${BASE_URL}/api/auth/organizer/create`,
    LOGIN: `${BASE_URL}/api/auth/organizer/login`,
    ME: `${BASE_URL}/api/auth/organizer/me`,
    GET_EVENTS: `${BASE_URL}/api/event/all`,
    PUBLISH_EVENTS: `${BASE_URL}/api/event/publish`,
    UPCOMING_EVENTS: `${BASE_URL}/api/event/upcoming-events`,
    CHECK_AVAILABILITY: (id: number) => `${BASE_URL}/api/ticket/${id}/availability`,
    BOOK_TICKET: (id: number) => `${BASE_URL}/api/ticket/${id}/book`,
    DOWNLOAD_TICKET: (id: number) => `${BASE_URL}/api/ticket/download/${id}/pdf`
}