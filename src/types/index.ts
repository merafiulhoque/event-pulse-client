
export type METHODS = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export interface RequestOptions {
    method?: METHODS
    body?: unknown
    credentials?: RequestCredentials
    headers?: HeadersInit
}

export interface ApiResponse<T> {
    success: boolean
    message: string
    data?: T
}

export interface JWT_PAYLOAD {
    id: number
    name: string
    email: string
}

export interface EVENTS {
    id: number;
    name: string;
    place: string;
    date: Date;
    capacity: number;
    organizerId: number;
    bookingStart: Date;
    bookingEnd: Date;
    createdAt: Date;
    updatedAt: Date;
}

enum Status {
    PENDING,
    CONFIRMED,
    CANCELLED
}

export interface Ticket {
    name: string;
    email: string;
    phone: string;
    status: Status;
    idempotencyKey: string;
    id: number;
    eventId: number;
}

export interface LIVE_EVENTS {
    id: number;
    name: string;
    place: string;
    capacity: number;
    bookingStart: Date;
    bookingEnd: Date;
    _count: {
        tickets: number;
    };
}