import { DexScreenerScraper, BirdeyeScraper, MoonarchScraper } from '../scrapers';
import { TokenData, ScraperConfig, ScraperResult } from '../types';

export class TokenScraperService {
  private dexScreener: DexScreenerScraper;
  private birdeye: BirdeyeScraper;
  private moonarch: MoonarchScraper;
  private config: ScraperConfig;

  constructor(config: ScraperConfig) {
    this.config = config;
    this.dexScreener = new DexScreenerScraper();
    this.birdeye = new BirdeyeScraper(config.apiKeys?.birdeye);
    this.moonarch = new MoonarchScraper(config.apiKeys?.moonarch);
  }

  /**
   * Fetch tokens from all configured sources
   */
  async fetchAllTokens(): Promise<TokenData[]> {
    console.log('Fetching tokens from all sources...');
    
    const results = await Promise.allSettled([
      this.dexScreener.fetchTrendingTokens(),
      this.birdeye.fetchTrendingTokens(),
      this.birdeye.fetchNewListings(),
      this.moonarch.fetchTrendingTokens(),
    ]);

    const allTokens: TokenData[] = [];

    for (const result of results) {
      if (result.status === 'fulfilled') {
        const scraperResult = result.value;
        if (scraperResult.error) {
          console.warn(`Error from ${scraperResult.source}:`, scraperResult.error);
        }
        allTokens.push(...scraperResult.tokens);
      } else {
        console.error('Scraper failed:', result.reason);
      }
    }

    console.log(`Fetched ${allTokens.length} tokens from all sources`);
    return allTokens;
  }

  /**
   * Fetch tokens from DexScreener only
   */
  async fetchDexScreenerTokens(): Promise<ScraperResult> {
    console.log('Fetching tokens from DexScreener...');
    return await this.dexScreener.fetchTrendingTokens();
  }

  /**
   * Fetch tokens from Birdeye only
   */
  async fetchBirdeyeTokens(): Promise<{ trending: ScraperResult; newListings: ScraperResult }> {
    console.log('Fetching tokens from Birdeye...');
    const [trending, newListings] = await Promise.all([
      this.birdeye.fetchTrendingTokens(),
      this.birdeye.fetchNewListings(),
    ]);
    return { trending, newListings };
  }

  /**
   * Fetch tokens from Moonarch only
   */
  async fetchMoonarchTokens(): Promise<ScraperResult> {
    console.log('Fetching tokens from Moonarch...');
    return await this.moonarch.fetchTrendingTokens();
  }

  /**
   * Fetch token by address from all sources
   */
  async fetchTokenByAddress(address: string): Promise<TokenData[]> {
    console.log(`Fetching token ${address} from all sources...`);
    
    const results = await Promise.allSettled([
      this.dexScreener.fetchTokenByAddress(address),
      this.birdeye.fetchTokenByAddress(address),
    ]);

    const tokens: TokenData[] = [];
    for (const result of results) {
      if (result.status === 'fulfilled') {
        tokens.push(...result.value.tokens);
      }
    }

    return tokens;
  }

  /**
   * Filter tokens by chain
   */
  filterByChain(tokens: TokenData[], chain: 'ethereum' | 'solana' | 'bnb'): TokenData[] {
    return tokens.filter((token) => token.chain === chain);
  }

  /**
   * Sort tokens by various criteria
   */
  sortTokens(
    tokens: TokenData[],
    sortBy: 'volume' | 'liquidity' | 'marketCap' | 'priceChange' = 'volume'
  ): TokenData[] {
    return [...tokens].sort((a, b) => {
      switch (sortBy) {
        case 'volume':
          return (b.volume24h || 0) - (a.volume24h || 0);
        case 'liquidity':
          return (b.liquidity || 0) - (a.liquidity || 0);
        case 'marketCap':
          return (b.marketCap || 0) - (a.marketCap || 0);
        case 'priceChange':
          return (b.priceChange24h || 0) - (a.priceChange24h || 0);
        default:
          return 0;
      }
    });
  }

  /**
   * Get top N tokens
   */
  getTopTokens(tokens: TokenData[], limit: number = 50): TokenData[] {
    return tokens.slice(0, limit);
  }

  /**
   * Remove duplicate tokens (by address)
   */
  removeDuplicates(tokens: TokenData[]): TokenData[] {
    const seen = new Set<string>();
    return tokens.filter((token) => {
      const key = `${token.chain}-${token.address}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * Get token summary statistics
   */
  getTokenStats(tokens: TokenData[]): {
    total: number;
    byChain: Record<string, number>;
    bySource: Record<string, number>;
    totalVolume: number;
    totalLiquidity: number;
  } {
    const stats = {
      total: tokens.length,
      byChain: {} as Record<string, number>,
      bySource: {} as Record<string, number>,
      totalVolume: 0,
      totalLiquidity: 0,
    };

    for (const token of tokens) {
      stats.byChain[token.chain] = (stats.byChain[token.chain] || 0) + 1;
      stats.bySource[token.source] = (stats.bySource[token.source] || 0) + 1;
      stats.totalVolume += token.volume24h || 0;
      stats.totalLiquidity += token.liquidity || 0;
    }

    return stats;
  }
}
