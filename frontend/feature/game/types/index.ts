export interface Player {
  id: number;
  name: string;
  score: number;
  color: string;
  pawnsLeft: number;
}

export type Losetas = {
  x?: number;
  y?: number;
  name?: string;
  color?: string;
};
