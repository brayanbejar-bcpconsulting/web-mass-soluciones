/**
 * Games API Client
 * Centralized client for all games API calls
 */

import type {
  GameConfigResponse,
  GuestPlayResponse,
  GameConfigPublic,
} from "./types";

// API URL from environment variable
const API_BASE_URL =
  import.meta.env.MARKET_DOLLAR_API_URL || "https://app.market-dollar.com/";

/**
 * Fetch all active game configurations
 */
export async function getGamesConfig(): Promise<GameConfigResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/games/config`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch games config: ${response.status}`);
  }

  return response.json();
}

/**
 * Get a specific game config by type
 */
export async function getGameByType(
  gameType: "SLOTS" | "CUPS" | "ROULETTE",
): Promise<GameConfigPublic | null> {
  const config = await getGamesConfig();
  return config.games.find((g) => g.game_type === gameType && g.active) || null;
}

/**
 * Play a game as guest (from landing - no auth required)
 */
export async function playGameAsGuest(
  gameId: string,
): Promise<GuestPlayResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/games/play-guest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ gameId }),
  });

  if (!response.ok) {
    throw new Error(`Failed to play game: ${response.status}`);
  }

  return response.json();
}

/**
 * Build claim URL for the app
 */
export function buildClaimUrl(token: string): string {
  const appUrl = "https://app.market-dollar.com";
  return `${appUrl}/claim/${token}`;
}
