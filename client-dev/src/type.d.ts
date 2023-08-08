declare module '*.less';

interface Window {
  gobang: {
    player1Run: (board: number[][]) => Promise<[number, number]>;
    player2Run: (board: number[][]) => Promise<[number, number]>;
  };
}
