'use client';

import { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';
import { gameConfig } from '../game/config';

export default function Game() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Evitar criar múltiplas instâncias do jogo, Pattern Singleton
    if (gameRef.current || !containerRef.current) return;

    // Configurar o container do jogo
    const config: Phaser.Types.Core.GameConfig = {
      ...gameConfig,
      parent: containerRef.current,
    };

    // Criar instância do Phaser
    gameRef.current = new Phaser.Game(config);

    // Cleanup ao desmontar o componente
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return <div id="game-container" ref={containerRef} />;
}
