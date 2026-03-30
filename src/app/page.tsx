'use client';

import dynamic from 'next/dynamic';

// Importar Game dinamicamente (client-side only) porque Phaser precisa do DOM
const Game = dynamic(() => import('../components/Game'), {
  ssr: false,
  loading: () => (
    <div className="loading-screen">
      <div className="loading-text">Carregando Witch Day...</div>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="w-full h-screen">
      <Game />
    </main>
  );
}
