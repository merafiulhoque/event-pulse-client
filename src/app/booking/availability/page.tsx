import BookingAvailability from "@/components/public/BookingAvailability";
import Loader from "@/components/utility/Loader";
import { Suspense } from "react";

export default function page(){
    return (
        <Suspense fallback={<Loader />}>
            <BookingAvailability />
        </Suspense>
    )
}