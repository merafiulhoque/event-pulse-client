import z from "zod";

// organizer create account related
export const OrganizerCreateSchema = z.object({
    name: z
            .string()
            .min(3, "Name must be minimum 3 character")
            .transform(name => 
                name
                .split(/\s+/)
                .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
                .join(" ")
            ),
    email: z.string().email("This is not a valid email").trim().toLowerCase(),
    password: z.string().min(6, "Min 6 character")
})

export type OrganizerCreateInput = z.infer<typeof OrganizerCreateSchema>;


// organizer login related
export const OrganizerLoginSchema = z.object({
  email: z.string().email("This is not a valid email").trim().toLowerCase(),
  password: z.string().min(6, "Min 6 character"),
});

export type OrganizerLoginData = z.infer<typeof OrganizerLoginSchema>;


// publish event related
export const EventCreateSchema = z.object({
    name: z.string().trim().min(3, "Min 3 characters Required").toUpperCase(),
    place: z.string().trim().min(3, "Min 3 characters Required").toUpperCase(),
    date: z.string().date(),
    time: z.string().trim().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
    capacity: z.number().min(1, "Min 1 is required"),
    bookingStartDate: z.string().date(),
    bookingStartTime: z.string().trim().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
    bookingEndDate: z.string().date(),
    bookingEndTime: z.string().trim().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
})

export type EventCreateData = z.infer<typeof EventCreateSchema>

export const TicketBookingSchema = z.object({
    name: z
            .string()
            .min(3, "Name must be minimum 3 character")
            .transform((name) =>
                name
                .split(/\s+/)
                .map(
                    (part) =>
                    part.charAt(0).toUpperCase() +
                    part.slice(1).toLowerCase()
                )
                .join(" ")
            ),

    email: z
            .string()
            .email("This is not a valid email")
            .trim()
            .toLowerCase(),

    phone: z
            .string()
            .trim()
            .regex(/^[6-9]\d{9}$/, "Phone number must be exactly 10 digits"),
})


export type ticketBookingData = z.infer<typeof TicketBookingSchema>
