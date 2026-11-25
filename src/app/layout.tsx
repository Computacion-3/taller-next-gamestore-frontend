import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { StoreProvider } from "@/shared/store/StoreProvider";
import { Header } from "@/shared/presentation/components/Header";
import { Footer } from "@/shared/presentation/components/Footer";
import { ToastContainer } from "@/shared/presentation/components/ToastContainer";
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
          {/* usePathname() en rutas dinámicas (/games/[id]) exige Suspense */}
          <Suspense fallback={<div className="h-[8.5rem] w-full bg-blue-cloud" />}>
            <Header />
          </Suspense>
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer />
          <ToastContainer />
        </StoreProvider>
      </body>
    </html>
  );
}