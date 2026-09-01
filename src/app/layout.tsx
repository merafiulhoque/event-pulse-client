import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/utility/Toaster";
import QueryProvider from "@/providers/QueryClient";


export const metadata: Metadata = {
  title: "Event Pulse",
  description: "Next Gen Ticket Booking",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
