import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import ClientLayout from './ClientLayout'
import { Toaster } from "react-hot-toast";

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-outfit',
})

export const metadata: Metadata = {
  title: 'Fodee Admin',
  description: 'Admin Dashboard for Mr.Fodee',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <Toaster position="top-right" reverseOrder={false} />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
