import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blu Fleet Demo — Sistema Gestione Noleggio Nautico',
  description: 'Prova la demo interattiva del sistema Blu Fleet powered by NS3000. Gestione prenotazioni, flotta, clienti e pagamenti per il noleggio nautico.',
  openGraph: {
    title: 'Blu Fleet Demo — Noleggio Nautico Digitale',
    description: 'Scopri come Blu Fleet digitalizza la gestione del noleggio nautico. Prova la demo interattiva.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}
