export const ORG = 'Hedgehog-Technologies';
export const ORG_URL = `https://github.com/${ORG}`;
export const SITE_NAME = 'Hedgehog Technologies';

export const GAMES = [
  { id: 'minecraft', name: 'Minecraft', blurb: 'Mods for Minecraft: Java Edition.', emoji: '⛏️' },
  { id: 'gtav', name: 'Grand Theft Auto V', blurb: 'FiveM resources, MLOs and tools.', emoji: '🚓' },
  { id: 'stardew', name: 'Stardew Valley', blurb: 'SMAPI mods for the valley.', emoji: '🌾' },
] as const;

export type GameId = (typeof GAMES)[number]['id'];
export const gameById = (id: string) => GAMES.find((g) => g.id === id);
