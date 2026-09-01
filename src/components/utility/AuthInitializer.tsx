"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { requireUser } from "@/actions/auth/requireUser"
import { useAuthStore } from "@/store/authStore"
import Loader from "./Loader"

const PUBLIC_ROUTES = ["/", "/login", "/create-account"];

export function AuthInitializer() {
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);
    
    const user = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);
    const clearUser = useAuthStore((state) => state.clearUser);

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    useEffect(() => {
        // If it's a public route, don't execute auth checks
        if (isPublicRoute) {
            setIsChecking(false);
            return;
        }

        // If user is already loaded in the store, skip fetching
        if (user) {
            setIsChecking(false);
            return;
        }

        const verifyUser = async () => {
            try {
                const response = await requireUser();

                if (response?.success && response?.data) {
                    setUser(response.data);
                } else {
                    clearUser();
                }
            } catch (error) {
                console.error("Failed to fetch user session:", error);
                clearUser();
            } finally {
                setIsChecking(false);
            }
        };

        verifyUser();
    }, [pathname, user, setUser, clearUser, isPublicRoute]);

    // Do not block public pages
    if (isPublicRoute) {
        return null;
    }

    // Show loader while checking the session on protected routes
    if (isChecking && !user) {
        return <Loader />;
    }

    return null;
}