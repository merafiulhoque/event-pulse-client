import { API_URLS } from "@/cfg";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: {params: Promise<{id: string}>}
){
    const paramValues = await params
    const id = Number(paramValues.id)

    if(!Number.isInteger(id) || id <= 0){
        return NextResponse.json({
            success: false,
            message: "Invalid Ticket ID"
        }, {status: 400})
    }

    const res = await fetch(
        API_URLS.DOWNLOAD_TICKET(id),
        {
            method: "GET",
        }
    )


    if(!res.ok){
        return NextResponse.json({
            success: false,
            message: "Download failed"
        },{ status: res.status })
    }

    return new NextResponse(
        res.body,
        {
            status: 200,
            headers: {
                "Content-Type": res.headers.get("Content-Type") ?? "application/pdf",
                "Content-Disposition": `attachment; filename=ticket_${id}.pdf`
            }
        }
    )

}