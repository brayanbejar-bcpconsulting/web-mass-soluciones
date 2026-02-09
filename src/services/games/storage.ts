/**
 * Games Storage Utilities
 * Handle local storage for game cooldowns and saved results
 */

import type { GameType, StoredGameResult } from "./types";
import { GAME_ROTATION } from "@/config/games";

const STORAGE_PREFIX = "md_game_";

const STORAGE_KEYS = {
  LAST_PLAY: (gameType: GameType) =>
    `${STORAGE_PREFIX}${gameType.toLowerCase()}_last_play`,
  RESULT: (gameType: GameType) =>
    `${STORAGE_PREFIX}${gameType.toLowerCase()}_result`,
} as const;

// 24 hours in milliseconds
const COOLDOWN_MS = 24 * 60 * 60 * 1000;

/**
 * Get today's available game based on rotation
 * Uses date modulo to cycle through games daily
 */
export function getTodaysGame(): GameType {
  const today = new Date();
  // Reset to start of day in Peru timezone (UTC-5)
  const peruDate = new Date(
    today.toLocaleString("en-US", { timeZone: "America/Lima" }),
  );
  const dayOfYear = Math.floor(
    (peruDate.getTime() - new Date(peruDate.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24),
  );
  const gameIndex = dayOfYear % GAME_ROTATION.length;
  return GAME_ROTATION[gameIndex];
}

/**
 * Check if a specific game is available today
 */
export function isGameAvailableToday(gameType: GameType): boolean {
  return getTodaysGame() === gameType;
}

/**
 * Check if user can play a specific game
 */
export function canPlay(gameType: GameType): boolean {
  if (typeof window === "undefined") return true;

  // First check if this game is available today
  if (!isGameAvailableToday(gameType)) return false;

  const lastPlay = localStorage.getItem(STORAGE_KEYS.LAST_PLAY(gameType));
  if (!lastPlay) return true;

  const elapsed = Date.now() - parseInt(lastPlay, 10);
  return elapsed >= COOLDOWN_MS;
}

/**
 * Get time remaining until next play (human readable)
 */
export function getTimeRemaining(gameType: GameType): string | null {
  if (typeof window === "undefined") return null;

  const lastPlay = localStorage.getItem(STORAGE_KEYS.LAST_PLAY(gameType));
  if (!lastPlay) return null;

  const remaining = COOLDOWN_MS - (Date.now() - parseInt(lastPlay, 10));
  if (remaining <= 0) return null;

  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

/**
 * Record that user just played a game
 */
export function recordPlay(gameType: GameType): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.LAST_PLAY(gameType), Date.now().toString());
}

/**
 * Save game result for later reference
 */
export function saveResult(result: StoredGameResult): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    STORAGE_KEYS.RESULT(result.gameType),
    JSON.stringify(result),
  );
}

/**
 * Get saved game result
 */
export function getSavedResult(gameType: GameType): StoredGameResult | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(STORAGE_KEYS.RESULT(gameType));
  if (!stored) return null;

  try {
    return JSON.parse(stored) as StoredGameResult;
  } catch {
    return null;
  }
}

/**
 * Clear saved result (e.g., after claiming)
 */
export function clearResult(gameType: GameType): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.RESULT(gameType));
}

/**
 * Format date for display (Spanish locale)
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
