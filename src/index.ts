import dotenv from 'dotenv';
import { createApp } from './utils/app';
import { ScraperConfig } from './types';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const FETCH_INTERVAL_MS = parseInt(process.env.FETCH_INTERVAL_MS || '60000');

// Configuration
const config: ScraperConfig = {
  chains: ['ethereum', 'solana', 'bnb'],
  interval: FETCH_INTERVAL_MS,
  apiKeys: {
    dexscreener: process.env.DEXSCREENER_API_KEY,
    birdeye: process.env.BIRDEYE_API_KEY,
    moonarch: process.env.MOONARCH_API_KEY,
  },
  filters: {
    maxAgeHours: parseInt(process.env.MAX_AGE_HOURS || '48'),
    maxHolders: parseInt(process.env.MAX_HOLDERS || '1000'),
    minLiquidity: parseInt(process.env.MIN_LIQUIDITY_USD || '5000'),
  },
  outputFormat: (process.env.OUTPUT_FORMAT as 'json' | 'markdown' | 'both') || 'both',
  githubIntegration: {
    enabled: process.env.GITHUB_ENABLED === 'true',
    token: process.env.GITHUB_TOKEN,
    repo: process.env.GITHUB_REPO,
  },
};

// Create Express app
const app = createApp(config);

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('🚀 DEX Token Scraper Service Started');
  console.log('='.repeat(60));
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`⛓️  Supported chains: ${config.chains.join(', ')}`);
  console.log(`🔄 Fetch interval: ${FETCH_INTERVAL_MS}ms`);
  console.log(`🔑 DexScreener API Key: ${config.apiKeys?.dexscreener ? '✓ Configured' : '✗ Not configured'}`);
  console.log(`🔑 Birdeye API Key: ${config.apiKeys?.birdeye ? '✓ Configured' : '✗ Not configured'}`);
  console.log(`🔑 Moonarch API Key: ${config.apiKeys?.moonarch ? '✓ Configured' : '✗ Not configured'}`);
  console.log(`🔧 Filters: Age=${config.filters?.maxAgeHours}h, Holders<=${config.filters?.maxHolders}, Liq>=$${config.filters?.minLiquidity}`);
  console.log(`📤 GitHub Integration: ${config.githubIntegration?.enabled ? '✓ Enabled' : '✗ Disabled'}`);
  console.log('='.repeat(60));
  console.log('📖 API Documentation: http://localhost:' + PORT);
  console.log('❤️  Health Check: http://localhost:' + PORT + '/health');
  console.log('='.repeat(60));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});
