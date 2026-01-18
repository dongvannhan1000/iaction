import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "IAction - From Idea to Action",
  description: "Personal software & app showcase. Discover innovative applications built with passion.",
  keywords: ["software", "apps", "portfolio", "developer", "IAction"],
  authors: [{ name: "IAction" }],
  openGraph: {
    title: "IAction - From Idea to Action",
    description: "Personal software & app showcase",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased bg-[#0A0A0F] text-white`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
