import type { Metadata } from "next";
import { Suspense } from "react";
import { Toaster } from "@/shared/presentation/components/Toaster";
import { RealtimeBridge } from "@/features/realtime/presentation/components/RealtimeBridge";
import { Geist, Geist_Mono } from "next/font/google";
import { StoreProvider } from "@/shared/store/StoreProvider";
import { Header } from "@/shared/presentation/components/Header";
import { HeaderFallback } from "@/shared/presentation/components/HeaderFallback";
import { Footer } from "@/shared/presentation/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GameStore · Clean Architecture",
  description:
    "Tienda digital de videojuegos con Next.js, Clean Architecture, Redux Toolkit y soporte dual REST/GraphQL.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">
        <StoreProvider>
          <RealtimeBridge />
          <Suspense fallback={<HeaderFallback />}>
            <Header />
          </Suspense>
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer />
          <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}