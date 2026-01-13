import axios, { AxiosInstance } from 'axios';
import { TokenData, ScraperResult } from '../types';

export class MoonarchScraper {
  private client: AxiosInstance;
  private baseUrl = 'https://api.moonarch.app'; // Hypothetical endpoint
  private apiKey: string | undefined;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { 'Authorization': `Bearer ${apiKey}` }),
      },
    });
  }

  /**
   * Fetch trending tokens from Moonarch
   * Note: This is a placeholder implementation as Moonarch API documentation may vary
   */
  async fetchTrendingTokens(): Promise<ScraperResult> {
    try {
      const timestamp = new Date().toISOString();
      
      // Moonarch API endpoint structure is hypothetical
      // In practice, you would need to check their actual API documentation
      const response = await this.client.get('/v1/trending');

      const tokens: TokenData[] = [];
      if (response.data && Array.isArray(response.data)) {
        for (const token of response.data) {
          tokens.push(this.transformTokenData(token, timestamp));
        }
      }

      return {
        tokens,
        source: 'moonarch',
        timestamp,
      };
    } catch (error) {
      console.error('Error fetching from Moonarch:', error);
      // Moonarch API may not be available or may require different authentication
      return {
        tokens: [],
        source: 'moonarch',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Moonarch API unavailable or requires configuration',
      };
    }
  }

  /**
   * Fetch new token launches
   */
  async fetchNewLaunches(): Promise<ScraperResult> {
    try {
      const timestamp = new Date().toISOString();
      
      const response = await this.client.get('/v1/new-launches');

      const tokens: TokenData[] = [];
      if (response.data && Array.isArray(response.data)) {
        for (const token of response.data) {
          tokens.push(this.transformTokenData(token, timestamp));
        }
      }

      return {
        tokens,
        source: 'moonarch',
        timestamp,
      };
    } catch (error) {
      console.error('Error fetching new launches from Moonarch:', error);
      return {
        tokens: [],
        source: 'moonarch',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Moonarch API unavailable or requires configuration',
      };
    }
  }

  /**
   * Transform Moonarch token data to our TokenData format
   */
  private transformTokenData(token: any, timestamp: string): TokenData {
    return {
      address: token.address || token.contractAddress || '',
      name: token.name || 'Unknown',
      symbol: token.symbol || 'UNKNOWN',
      chain: this.detectChain(token.chain || token.network),
      dex: token.dex || 'unknown',
      priceUsd: parseFloat(token.price || token.priceUsd || '0'),
      priceChange24h: parseFloat(token.priceChange24h || '0'),
      volume24h: parseFloat(token.volume24h || '0'),
      liquidity: parseFloat(token.liquidity || '0'),
      marketCap: parseFloat(token.marketCap || '0'),
      holders: token.holders ? parseInt(token.holders) : undefined,
      createdAt: token.createdAt || token.launchTime,
      url: token.url,
      source: 'moonarch',
      scrapedAt: timestamp,
    };
  }

  /**
   * Detect and normalize chain name
   */
  private detectChain(chain: string | undefined): 'ethereum' | 'solana' | 'bnb' {
    if (!chain) return 'ethereum';
    
    const normalized = chain.toLowerCase();
    
    if (normalized.includes('ethereum') || normalized === 'eth') return 'ethereum';
    if (normalized.includes('solana') || normalized === 'sol') return 'solana';
    if (normalized.includes('bsc') || normalized.includes('bnb') || normalized.includes('binance')) return 'bnb';
    
    return 'ethereum'; // default
  }
}
