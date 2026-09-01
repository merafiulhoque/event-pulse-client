import {LayoutDashboardIcon, Settings, SpeakerIcon} from "lucide-react"

export const SidebarOptions = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboardIcon
    },
    {
        label: "Manage Events",
        href: "/dashboard/events/manage",
        icon: Settings
    },
    {
        label: "Publish Events",
        href: "/dashboard/events/publish",
        icon: SpeakerIcon
    }
]