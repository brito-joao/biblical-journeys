import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import { TimelineProvider } from "@/context/TimelineContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  weight: ["300", "400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Biblical Journeys",
  description: "An interactive 3D globe showing historical biblical journeys.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${merriweather.variable} antialiased bg-[#FAFAFA] text-slate-800 font-sans`}
      >
        <TimelineProvider>
          {children}
        </TimelineProvider>
      </body>
    </html>
  );
}
