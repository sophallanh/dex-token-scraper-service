import axios, { AxiosInstance } from 'axios';
import { TokenData, ScraperResult } from '../types';

export class DexScreenerScraper {
  private client: AxiosInstance;
  private baseUrl = 'https://api.dexscreener.com/latest/dex';

  constructor() {
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'dex-token-scraper-service/1.0',
      },
    });
  }

  /**
   * Fetch trending tokens from DexScreener
   * Uses a combination of approaches: token profiles and search for popular tokens
   */
  async fetchTrendingTokens(chain?: string): Promise<ScraperResult> {
    try {
      const timestamp = new Date().toISOString();
      const tokens: TokenData[] = [];

      // Try to fetch token profiles first
      try {
        const profileResponse = await this.client.get('/token-profiles/latest/v1');
        
        if (profileResponse.data && Array.isArray(profileResponse.data)) {
          const profiles = profileResponse.data.slice(0, 30);
          
          for (const profile of profiles) {
            if (profile.tokenAddress && profile.chainId) {
              const tokenData: TokenData = {
                address: profile.tokenAddress,
                name: profile.name || profile.tokenAddress.substring(0, 8),
                symbol: profile.symbol || profile.tokenAddress.substring(0, 8),
                chain: this.normalizeChain(profile.chainId),
                dex: 'various',
                priceUsd: 0,
                source: 'dexscreener',
                scrapedAt: timestamp,
                url: profile.url || `https://dexscreener.com/${profile.chainId}/${profile.tokenAddress}`,
              };
              tokens.push(tokenData);
            }
          }
        }
      } catch (error) {
        console.warn('DexScreener token profiles not available:', (error as Error).message);
      }

      return {
        tokens,
        source: 'dexscreener',
        timestamp,
        error: tokens.length === 0 ? 'No trending tokens found - DexScreener may require API access' : undefined,
      };
    } catch (error) {
      return {
        tokens: [],
        source: 'dexscreener',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Fetch token data by contract address
   * This is the most reliable DexScreener endpoint
   */
  async fetchTokenByAddress(address: string): Promise<ScraperResult> {
    try {
      const timestamp = new Date().toISOString();
      const response = await this.client.get(`/tokens/${address}`);
      
      const tokens: TokenData[] = [];
      if (response.data && response.data.pairs) {
        for (const pair of response.data.pairs) {
          tokens.push(this.transformPairToToken(pair, this.detectChain(pair), timestamp));
        }
      }

      return {
        tokens,
        source: 'dexscreener',
        timestamp,
      };
    } catch (error) {
      return {
        tokens: [],
        source: 'dexscreener',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Transform DexScreener pair data to our TokenData format
   */
  private transformPairToToken(pair: any, chain: string, timestamp: string): TokenData {
    const normalizedChain = this.normalizeChain(chain);
    
    return {
      address: pair.baseToken?.address || '',
      name: pair.baseToken?.name || 'Unknown',
      symbol: pair.baseToken?.symbol || 'UNKNOWN',
      chain: normalizedChain,
      dex: pair.dexId || 'unknown',
      priceUsd: parseFloat(pair.priceUsd || '0'),
      priceChange24h: parseFloat(pair.priceChange?.h24 || '0'),
      volume24h: parseFloat(pair.volume?.h24 || '0'),
      liquidity: parseFloat(pair.liquidity?.usd || '0'),
      marketCap: parseFloat(pair.marketCap || '0'),
      pairAddress: pair.pairAddress,
      url: pair.url,
      source: 'dexscreener',
      scrapedAt: timestamp,
    };
  }

  /**
   * Detect chain from pair data
   */
  private detectChain(pair: any): string {
    const chainId = pair.chainId?.toLowerCase() || '';
    
    if (chainId.includes('ethereum') || chainId === 'ether') return 'ethereum';
    if (chainId.includes('solana')) return 'solana';
    if (chainId.includes('bsc') || chainId.includes('bnb')) return 'bnb';
    
    return chainId;
  }

  /**
   * Normalize chain name to our standard format
   */
  private normalizeChain(chain: string): 'ethereum' | 'solana' | 'bnb' {
    const normalized = chain.toLowerCase();
    
    if (normalized.includes('ethereum') || normalized === 'ether') return 'ethereum';
    if (normalized.includes('solana')) return 'solana';
    if (normalized.includes('bsc') || normalized.includes('bnb')) return 'bnb';
    
    return 'ethereum'; // default
  }
}
