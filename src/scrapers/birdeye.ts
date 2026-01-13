import axios, { AxiosInstance } from 'axios';
import { TokenData, ScraperResult } from '../types';

export class BirdeyeScraper {
  private client: AxiosInstance;
  private baseUrl = 'https://public-api.birdeye.so';
  private apiKey: string | undefined;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { 'X-API-KEY': apiKey }),
      },
    });
  }

  /**
   * Fetch trending tokens from Birdeye (Solana focused)
   */
  async fetchTrendingTokens(): Promise<ScraperResult> {
    try {
      const timestamp = new Date().toISOString();
      const tokens: TokenData[] = [];

      // Birdeye is primarily for Solana, fetch trending tokens
      const response = await this.client.get('/defi/v3/token/trending', {
        params: {
          sort_by: 'rank',
          sort_type: 'asc',
          offset: 0,
          limit: 50,
        },
      });

      if (response.data && response.data.data && response.data.data.tokens) {
        for (const token of response.data.data.tokens) {
          tokens.push(this.transformTokenData(token, timestamp));
        }
      }

      return {
        tokens,
        source: 'birdeye',
        timestamp,
      };
    } catch (error) {
      console.error('Error fetching from Birdeye:', error);
      return {
        tokens: [],
        source: 'birdeye',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Fetch token overview by address (Solana)
   */
  async fetchTokenByAddress(address: string): Promise<ScraperResult> {
    try {
      const timestamp = new Date().toISOString();
      const response = await this.client.get(`/defi/v3/token/overview`, {
        params: {
          address: address,
        },
      });

      const tokens: TokenData[] = [];
      if (response.data && response.data.data) {
        tokens.push(this.transformTokenOverview(response.data.data, timestamp));
      }

      return {
        tokens,
        source: 'birdeye',
        timestamp,
      };
    } catch (error) {
      return {
        tokens: [],
        source: 'birdeye',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Fetch new listings on Solana
   */
  async fetchNewListings(): Promise<ScraperResult> {
    try {
      const timestamp = new Date().toISOString();
      const tokens: TokenData[] = [];

      const response = await this.client.get('/defi/v3/token/new-listing', {
        params: {
          sort_by: 'listing_time',
          sort_type: 'desc',
          offset: 0,
          limit: 50,
        },
      });

      if (response.data && response.data.data && response.data.data.tokens) {
        for (const token of response.data.data.tokens) {
          tokens.push(this.transformTokenData(token, timestamp));
        }
      }

      return {
        tokens,
        source: 'birdeye',
        timestamp,
      };
    } catch (error) {
      console.error('Error fetching new listings from Birdeye:', error);
      return {
        tokens: [],
        source: 'birdeye',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Transform Birdeye token data to our TokenData format
   */
  private transformTokenData(token: Record<string, any>, timestamp: string): TokenData {
    return {
      address: token.address || '',
      name: token.name || 'Unknown',
      symbol: token.symbol || 'UNKNOWN',
      chain: 'solana',
      dex: 'jupiter',
      priceUsd: parseFloat(token.price || token.v24hUSD || '0'),
      priceChange24h: parseFloat(token.v24hChangePercent || '0'),
      volume24h: parseFloat(token.v24hUSD || '0'),
      liquidity: parseFloat(token.liquidity || '0'),
      marketCap: parseFloat(token.mc || token.marketCap || '0'),
      holders: token.holder ? parseInt(token.holder) : undefined,
      url: token.address ? `https://birdeye.so/token/${token.address}` : undefined,
      source: 'birdeye',
      scrapedAt: timestamp,
    };
  }

  /**
   * Transform Birdeye token overview to our TokenData format
   */
  private transformTokenOverview(data: Record<string, any>, timestamp: string): TokenData {
    return {
      address: data.address || '',
      name: data.name || 'Unknown',
      symbol: data.symbol || 'UNKNOWN',
      chain: 'solana',
      dex: 'jupiter',
      priceUsd: parseFloat(data.price || '0'),
      priceChange24h: parseFloat(data.priceChange24h || '0'),
      volume24h: parseFloat(data.volume24h || '0'),
      liquidity: parseFloat(data.liquidity || '0'),
      marketCap: parseFloat(data.marketCap || '0'),
      holders: data.holder ? parseInt(data.holder) : undefined,
      createdAt: data.creationTime ? new Date(data.creationTime * 1000).toISOString() : undefined,
      url: data.address ? `https://birdeye.so/token/${data.address}` : undefined,
      source: 'birdeye',
      scrapedAt: timestamp,
    };
  }
}
