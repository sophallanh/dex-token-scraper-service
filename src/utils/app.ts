import express, { Request, Response } from 'express';
import { TokenScraperService } from '../services';
import { ScraperConfig } from '../types';
import { generateMockTokens, generateMockTrendingTokens } from './mockData';

export function createApp(config: ScraperConfig): express.Application {
  const app = express();
  const scraperService = new TokenScraperService(config);

  app.use(express.json());

  // Health check endpoint
  app.get('/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'dex-token-scraper-service',
    });
  });

  // Get all tokens from all sources
  app.get('/api/tokens', async (req: Request, res: Response) => {
    try {
      const tokens = await scraperService.fetchAllTokens();
      const uniqueTokens = scraperService.removeDuplicates(tokens);
      const sortedTokens = scraperService.sortTokens(
        uniqueTokens,
        (req.query.sortBy as any) || 'volume'
      );
      const limitedTokens = scraperService.getTopTokens(
        sortedTokens,
        parseInt(req.query.limit as string) || 100
      );

      res.json({
        success: true,
        count: limitedTokens.length,
        tokens: limitedTokens,
        stats: scraperService.getTokenStats(limitedTokens),
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching tokens:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // Get mock/demo tokens for testing
  app.get('/api/tokens/demo', (req: Request, res: Response) => {
    try {
      const count = parseInt(req.query.count as string) || 10;
      const tokens = generateMockTrendingTokens(count);
      
      res.json({
        success: true,
        mode: 'demo',
        count: tokens.length,
        tokens,
        stats: scraperService.getTokenStats(tokens),
        timestamp: new Date().toISOString(),
        note: 'This is demo data. Configure API keys in .env for real data.',
      });
    } catch (error) {
      console.error('Error generating demo tokens:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // Get tokens by chain
  app.get('/api/tokens/:chain', async (req: Request, res: Response) => {
    try {
      const chain = req.params.chain as 'ethereum' | 'solana' | 'bnb';
      if (!['ethereum', 'solana', 'bnb'].includes(chain)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid chain. Must be one of: ethereum, solana, bnb',
        });
      }

      const tokens = await scraperService.fetchAllTokens();
      const uniqueTokens = scraperService.removeDuplicates(tokens);
      const chainTokens = scraperService.filterByChain(uniqueTokens, chain);
      const sortedTokens = scraperService.sortTokens(
        chainTokens,
        (req.query.sortBy as any) || 'volume'
      );
      const limitedTokens = scraperService.getTopTokens(
        sortedTokens,
        parseInt(req.query.limit as string) || 50
      );

      res.json({
        success: true,
        chain,
        count: limitedTokens.length,
        tokens: limitedTokens,
        stats: scraperService.getTokenStats(limitedTokens),
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching tokens by chain:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // Get tokens from DexScreener only
  app.get('/api/sources/dexscreener', async (req: Request, res: Response) => {
    try {
      const result = await scraperService.fetchDexScreenerTokens();
      
      res.json({
        success: !result.error,
        source: result.source,
        count: result.tokens.length,
        tokens: result.tokens,
        error: result.error,
        timestamp: result.timestamp,
      });
    } catch (error) {
      console.error('Error fetching DexScreener tokens:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // Get tokens from Birdeye only
  app.get('/api/sources/birdeye', async (req: Request, res: Response) => {
    try {
      const result = await scraperService.fetchBirdeyeTokens();
      
      res.json({
        success: true,
        source: 'birdeye',
        trending: {
          count: result.trending.tokens.length,
          tokens: result.trending.tokens,
          error: result.trending.error,
        },
        newListings: {
          count: result.newListings.tokens.length,
          tokens: result.newListings.tokens,
          error: result.newListings.error,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching Birdeye tokens:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // Get tokens from Moonarch only
  app.get('/api/sources/moonarch', async (req: Request, res: Response) => {
    try {
      const result = await scraperService.fetchMoonarchTokens();
      
      res.json({
        success: !result.error,
        source: result.source,
        count: result.tokens.length,
        tokens: result.tokens,
        error: result.error,
        timestamp: result.timestamp,
      });
    } catch (error) {
      console.error('Error fetching Moonarch tokens:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // Get token by address
  app.get('/api/token/:address', async (req: Request, res: Response) => {
    try {
      const address = req.params.address;
      const tokens = await scraperService.fetchTokenByAddress(address);

      res.json({
        success: true,
        address,
        count: tokens.length,
        tokens,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching token by address:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // API documentation endpoint
  app.get('/', (req: Request, res: Response) => {
    res.json({
      service: 'DEX Token Scraper Service',
      version: '1.0.0',
      description: 'Automated token scraper service for DEX aggregators',
      endpoints: {
        health: 'GET /health',
        allTokens: 'GET /api/tokens?sortBy=volume&limit=100',
        demoTokens: 'GET /api/tokens/demo?count=10',
        byChain: 'GET /api/tokens/:chain (ethereum|solana|bnb)',
        dexscreener: 'GET /api/sources/dexscreener',
        birdeye: 'GET /api/sources/birdeye',
        moonarch: 'GET /api/sources/moonarch',
        byAddress: 'GET /api/token/:address',
      },
      supportedChains: ['ethereum', 'solana', 'bnb'],
      supportedDEXs: {
        ethereum: ['Uniswap'],
        solana: ['Jupiter'],
        bnb: ['PancakeSwap'],
      },
    });
  });

  return app;
}
