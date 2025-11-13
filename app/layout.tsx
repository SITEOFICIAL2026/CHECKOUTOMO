import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Checkout PIX - OMO",
  description: "Finalize seu pagamento via PIX de forma rápida e segura",
  generator: "v0.app",
  icons: {
    icon: "https://www.omo.com/images/h0nadbhvm6m4/68zXpMN3Shc1IgECsZjlFg/9505212f848a00b77ba23ca9cadea243/T01PX0xPR09fTE9DS1VQX0hPUklaX0JMVUUyOTRfUkdCX18xXy5wbmc/320w-184h/omo-logo.avif",
    apple:
      "https://www.omo.com/images/h0nadbhvm6m4/68zXpMN3Shc1IgECsZjlFg/9505212f848a00b77ba23ca9cadea243/T01PX0xPR09fTE9DS1VQX0hPUklaX0JMVUUyOTRfUkdCX18xXy5wbmc/320w-184h/omo-logo.avif",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#103e84",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={poppins.className}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
