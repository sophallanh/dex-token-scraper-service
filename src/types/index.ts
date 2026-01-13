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
  pairAddress?: string;
  url?: string;
  source: 'dexscreener' | 'birdeye' | 'moonarch';
  scrapedAt: string;
}

export interface ScraperConfig {
  chains: string[];
  interval?: number;
  apiKeys?: {
    birdeye?: string;
    moonarch?: string;
  };
}

export interface ScraperResult {
  tokens: TokenData[];
  source: string;
  timestamp: string;
  error?: string;
}
