import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "VedaAI · AI Assessment Mapper",
  description:
    "Upload a question paper and a student answer sheet — extract, map, highlight and grade answers with AI.",
};

export const viewport: Viewport = {
  themeColor: "#f4571f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
