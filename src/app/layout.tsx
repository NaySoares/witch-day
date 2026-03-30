import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Witch Day',
  description: 'Game RPG 2D de uma aprendiz de bruxa',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-city-dark min-h-screen">
        {children}
      </body>
    </html>
  );
}
