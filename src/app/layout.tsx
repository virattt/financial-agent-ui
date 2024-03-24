import "@/styles/globals.css";
import { Inter as FontSans } from "next/font/google";
import { AI } from "./action";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@radix-ui/react-tooltip";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
