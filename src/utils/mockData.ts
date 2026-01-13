import { TokenData } from '../types';

/**
 * Generate mock token data for demonstration purposes
 * This is useful when API keys are not configured or for testing
 */
export function generateMockTokens(): TokenData[] {
  const timestamp = new Date().toISOString();
  
  return [
    {
      address: '0x1234567890123456789012345678901234567890',
      name: 'Mock Ethereum Token',
      symbol: 'METH',
      chain: 'ethereum',
      dex: 'uniswap',
      priceUsd: 1.25,
      priceChange24h: 15.5,
      volume24h: 1500000,
      liquidity: 5000000,
      marketCap: 50000000,
      holders: 15000,
      pairAddress: '0xpair1234567890',
      url: 'https://dexscreener.com/ethereum/0x1234567890123456789012345678901234567890',
      source: 'dexscreener',
      scrapedAt: timestamp,
    },
    {
      address: 'So11111111111111111111111111111111111111112',
      name: 'Mock Solana Token',
      symbol: 'MSOL',
      chain: 'solana',
      dex: 'jupiter',
      priceUsd: 0.85,
      priceChange24h: -5.2,
      volume24h: 2500000,
      liquidity: 8000000,
      marketCap: 35000000,
      holders: 25000,
      url: 'https://birdeye.so/token/So11111111111111111111111111111111111111112',
      source: 'birdeye',
      scrapedAt: timestamp,
    },
    {
      address: '0xbnb1234567890123456789012345678901234567',
      name: 'Mock BNB Token',
      symbol: 'MBNB',
      chain: 'bnb',
      dex: 'pancakeswap',
      priceUsd: 2.50,
      priceChange24h: 8.3,
      volume24h: 1200000,
      liquidity: 4500000,
      marketCap: 25000000,
      holders: 10000,
      pairAddress: '0xpairbnb123456',
      url: 'https://dexscreener.com/bsc/0xbnb1234567890123456789012345678901234567',
      source: 'dexscreener',
      scrapedAt: timestamp,
    },
  ];
}

/**
 * Generate mock trending tokens
 */
export function generateMockTrendingTokens(count: number = 10): TokenData[] {
  const mockTokens: TokenData[] = [];
  const chains: Array<'ethereum' | 'solana' | 'bnb'> = ['ethereum', 'solana', 'bnb'];
  const dexes = ['uniswap', 'jupiter', 'pancakeswap'];
  const timestamp = new Date().toISOString();

  for (let i = 0; i < count; i++) {
    const chain = chains[i % chains.length];
    const dex = dexes[i % dexes.length];
    
    // Generate valid Ethereum-style addresses (42 chars with 0x prefix)
    const address = `0x${i.toString(16).padStart(40, '0')}`;
    
    mockTokens.push({
      address,
      name: `Trending Token ${i + 1}`,
      symbol: `TRD${i + 1}`,
      chain,
      dex,
      priceUsd: Math.random() * 10,
      priceChange24h: (Math.random() - 0.5) * 50,
      volume24h: Math.random() * 5000000,
      liquidity: Math.random() * 10000000,
      marketCap: Math.random() * 100000000,
      holders: Math.floor(Math.random() * 50000),
      source: 'dexscreener',
      scrapedAt: timestamp,
    });
  }

  return mockTokens;
}
