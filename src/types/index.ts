// Common types for token data across all DEX platforms

export interface TokenData {
  address: string;
  name: string;
  symbol: string;
  chain: 'ethereum' | 'solana' | 'bnb';
  dex: string;
  priceUsd: number;
  priceChange24h?: number;
  volume24h?: number;
  liquidity?: number;
  marketCap?: number;
  holders?: number;
  createdAt?: string;
  launchDate?: string;
  launchStatus?: 'pre-launch' | 'fair-launch' | 'public' | 'unknown';
  pairAddress?: string;
  url?: string;
  socialLinks?: {
    twitter?: string;
    telegram?: string;
    website?: string;
    discord?: string;
  };
  source: 'dexscreener' | 'birdeye' | 'moonarch';
  scrapedAt: string;
  // Safety and filtering metadata
  isNewPair?: boolean; // Within last 24-48 hours
  hasLowHolders?: boolean; // Below threshold
  isFairLaunch?: boolean;
  passedSafetyChecks?: boolean;
}

export interface ScraperConfig {
  chains: string[];
  interval?: number;
  apiKeys?: {
    dexscreener?: string;
    birdeye?: string;
    moonarch?: string;
  };
  filters?: {
    maxAgeHours?: number; // Filter for new pairs (default: 48)
    maxHolders?: number; // Low holder threshold (default: 1000)
    minLiquidity?: number; // Minimum liquidity in USD (default: 5000)
  };
  outputFormat?: 'json' | 'markdown' | 'both';
  githubIntegration?: {
    enabled: boolean;
    token?: string;
    repo?: string; // e.g., 'username/drip-dex-launches'
  };
}

export interface ScraperResult {
  tokens: TokenData[];
  source: string;
  timestamp: string;
  error?: string;
}

export interface FilterCriteria {
  newPairsOnly?: boolean;
  maxAgeHours?: number;
  maxHolders?: number;
  minLiquidity?: number;
  excludeScams?: boolean;
  fairLaunchOnly?: boolean;
}
