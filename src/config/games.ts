/**
 *
 * ["ROULETTE", "SLOTS", "CUPS"] - Ahora la ruleta aparece primero
 * ["CUPS", "ROULETTE", "SLOTS"] - Ahora los cofres aparecen primero
 */

export const GAME_ROTATION = [ "SLOTS" ,"CUPS", "ROULETTE" ] as const;

export type GameType = (typeof GAME_ROTATION)[number];
