import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./ClientLayout"

export const metadata: Metadata = {
  title: "Hoa Lư City Hotel - Sang trọng & Trang nhã",
  description: "Khách sạn Hoa Lư - Trải nghiệm nghỉ dưỡng sang trọng gần cố đô Hoa Lư với dịch vụ 4 sao",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientLayout>{children}</ClientLayout>
}


import './globals.css'