import type { Metadata } from "next";
import { Geist, Geist_Mono, Gideon_Roman } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import ClientLayout from "@/components/layout/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const gideonRoman = Gideon_Roman({
  variable: "--font-gideon-roman",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Drink Shop - Rượu vang và rượu ngoại cao cấp",
  description:
    "Chuyên cung cấp các loại rượu vang và rượu ngoại cao cấp với chất lượng tuyệt vời",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${gideonRoman.variable} antialiased`}
      >
        <ThemeProvider>
          <SessionProvider>
            <div className="font-roman">
              <ClientLayout>{children}</ClientLayout>
            </div>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
