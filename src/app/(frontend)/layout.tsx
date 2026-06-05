import React from 'react'
import './styles.css'

export const metadata = {
  title: 'What Kind of Cosmic Animal Are You?',
  description:
    'A 10-question personality quiz that reveals your inner cosmic animal. Discover if you are a Mooncat, Solar Fox, Cosmic Bear, or Galactic Dragon.',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
