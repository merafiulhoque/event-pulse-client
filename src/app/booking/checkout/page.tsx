import TicketBookingCheckoutPage from "@/components/public/TicketBookingCheckoutPage";
import Loader from "@/components/utility/Loader";
import { Suspense } from "react";

export default function page(){
    return (
        <Suspense fallback={<Loader />}>
            <TicketBookingCheckoutPage />
        </Suspense>

    )
}