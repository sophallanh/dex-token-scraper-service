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
    birdeye: process.env.BIRDEYE_API_KEY,
    moonarch: process.env.MOONARCH_API_KEY,
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
  console.log(`🔑 Birdeye API Key: ${config.apiKeys?.birdeye ? '✓ Configured' : '✗ Not configured'}`);
  console.log(`🔑 Moonarch API Key: ${config.apiKeys?.moonarch ? '✓ Configured' : '✗ Not configured'}`);
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
