import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import NavBar from '@/components/NavBar'
import { Providers } from './providers'

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: 'Taxi Booking App',
  description: 'Book your taxi ride with ease',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body className={outfit.className}>
          <Providers>
            <NavBar />
            {children}
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
