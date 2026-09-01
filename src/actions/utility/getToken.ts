import { cookies } from "next/headers";

export async function getToken(key: string){
    const cookieStore = await cookies()
    return cookieStore.get(key)?.value
}