import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DeepInspect | Trabajo de Fin de Grado",
  description: "Tu herramienta definitiva para explorar, escanear y proteger dominios e infraestructuras digitales con análisis precisos de WHOIS, vulnerabilidades y mapeo de redes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="./icono.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Tu herramienta definitiva para explorar, escanear y proteger dominios e infraestructuras digitales con análisis precisos de WHOIS, vulnerabilidades y mapeo de redes."
        />
        <link rel="apple-touch-icon" href="/Logo.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        {children}
        <Footer/>
      </body>
    </html>
  );
}
