/**
 * Games API Types
 * Matches the backend types from web-market-dollar
 */

// ============================================
// GAME CONFIG TYPES (from /api/v1/games/config)
// ============================================

export interface GameTierPublic {
	id: string;
	label: string;
	visual_symbols: string[];
}

export interface GameConfigPublic {
	id: string;
	name: string;
	game_type: "SLOTS" | "CUPS" | "ROULETTE";
	active: boolean;
	tiers: GameTierPublic[];
}

export interface GameConfigResponse {
	games: GameConfigPublic[];
}

// ============================================
// GUEST PLAY TYPES (from /api/v1/games/play-guest)
// ============================================

export interface GuestPlayResult {
	won: boolean;
	tier_label: string;
	visual_symbols: string[];
}

export interface GuestPlayClaim {
	token: string;
	expires_at: string;
	claim_url: string;
}

export interface GuestPlayCooldown {
	next_play_at: string;
}

export interface GuestPlayResponse {
	success: boolean;
	error?: "rate_limited" | "game_not_found" | "game_inactive" | "no_tiers" | "internal_error";
	game_type?: string;
	result?: GuestPlayResult;
	claim?: GuestPlayClaim;
	cooldown?: GuestPlayCooldown;
}

// ============================================
// FRONTEND GAME STATE
// ============================================

export type GameType = "SLOTS" | "CUPS" | "ROULETTE";

export interface StoredGameResult {
	gameType: GameType;
	claimToken: string;
	claimUrl: string;
	tierLabel: string;
	visualSymbols: string[];
	expiresAt: string;
	playedAt: string;
}
