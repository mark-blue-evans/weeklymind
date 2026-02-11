import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WeeklyMind - Private Mental Wellness',
  description: 'Private weekly check-ins and mental wellness journaling. Your thoughts stay on your device.',
  keywords: ['mental health', 'weekly check-in', 'journal', 'wellness', 'private', 'self-reflection'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
