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
      },
    });
  }

  /**
   * Fetch trending tokens from DexScreener
   */
  async fetchTrendingTokens(chain?: string): Promise<ScraperResult> {
    try {
      const timestamp = new Date().toISOString();
      const tokens: TokenData[] = [];

      // Fetch trending pairs for specific chains
      const chains = chain ? [chain] : ['ethereum', 'solana', 'bsc'];
      
      for (const chainName of chains) {
        try {
          const response = await this.client.get(`/search?q=${chainName}`);
          
          if (response.data && response.data.pairs) {
            const pairs = response.data.pairs.slice(0, 20); // Get top 20
            
            for (const pair of pairs) {
              tokens.push(this.transformPairToToken(pair, chainName, timestamp));
            }
          }
        } catch (error) {
          console.error(`Error fetching ${chainName} from DexScreener:`, error);
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
   * Fetch token data by contract address
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
