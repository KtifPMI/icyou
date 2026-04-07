import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ICYOU — Свобода в каждой нити',
  description: 'Свободные силуэты в духе восточноазиатского минимализма',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}