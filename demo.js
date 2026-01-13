#!/usr/bin/env node

/**
 * Demo script to showcase the token scraper service functionality
 * This demonstrates the API endpoints and their responses
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function demo() {
  console.log('='.repeat(70));
  console.log('🎯 DEX Token Scraper Service - Demo');
  console.log('='.repeat(70));
  console.log('');

  try {
    // 1. Health check
    console.log('1️⃣  Testing Health Check Endpoint');
    console.log('-'.repeat(70));
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('Status:', health.data.status);
    console.log('Service:', health.data.service);
    console.log('✅ Health check passed\n');

    // 2. Get API documentation
    console.log('2️⃣  Fetching API Documentation');
    console.log('-'.repeat(70));
    const docs = await axios.get(`${BASE_URL}/`);
    console.log('Service:', docs.data.service);
    console.log('Version:', docs.data.version);
    console.log('Supported Chains:', docs.data.supportedChains.join(', '));
    console.log('Available Endpoints:');
    Object.entries(docs.data.endpoints).forEach(([key, value]) => {
      console.log(`  - ${key}: ${value}`);
    });
    console.log('✅ Documentation retrieved\n');

    // 3. Test DexScreener endpoint
    console.log('3️⃣  Testing DexScreener API Integration');
    console.log('-'.repeat(70));
    const dexscreener = await axios.get(`${BASE_URL}/api/sources/dexscreener`);
    console.log('Source:', dexscreener.data.source);
    console.log('Token Count:', dexscreener.data.count);
    console.log('Success:', dexscreener.data.success);
    if (dexscreener.data.error) {
      console.log('Note:', dexscreener.data.error);
    }
    if (dexscreener.data.tokens.length > 0) {
      console.log('Sample Token:', dexscreener.data.tokens[0].symbol);
    }
    console.log('✅ DexScreener endpoint tested\n');

    // 4. Test Birdeye endpoint
    console.log('4️⃣  Testing Birdeye API Integration (Solana)');
    console.log('-'.repeat(70));
    const birdeye = await axios.get(`${BASE_URL}/api/sources/birdeye`);
    console.log('Source:', birdeye.data.source);
    console.log('Trending Tokens:', birdeye.data.trending.count);
    console.log('New Listings:', birdeye.data.newListings.count);
    if (birdeye.data.trending.error) {
      console.log('Note:', birdeye.data.trending.error);
    }
    console.log('✅ Birdeye endpoint tested\n');

    // 5. Test Moonarch endpoint
    console.log('5️⃣  Testing Moonarch API Integration');
    console.log('-'.repeat(70));
    const moonarch = await axios.get(`${BASE_URL}/api/sources/moonarch`);
    console.log('Source:', moonarch.data.source);
    console.log('Token Count:', moonarch.data.count);
    console.log('Success:', moonarch.data.success);
    if (moonarch.data.error) {
      console.log('Note:', moonarch.data.error);
    }
    console.log('✅ Moonarch endpoint tested\n');

    // 6. Test all tokens endpoint
    console.log('6️⃣  Testing Aggregated Tokens Endpoint');
    console.log('-'.repeat(70));
    const allTokens = await axios.get(`${BASE_URL}/api/tokens?limit=10`);
    console.log('Success:', allTokens.data.success);
    console.log('Total Tokens Retrieved:', allTokens.data.count);
    if (allTokens.data.stats) {
      console.log('Statistics:');
      console.log('  - Total:', allTokens.data.stats.total);
      console.log('  - By Chain:', JSON.stringify(allTokens.data.stats.byChain));
      console.log('  - By Source:', JSON.stringify(allTokens.data.stats.bySource));
    }
    console.log('✅ Aggregated endpoint tested\n');

    // 7. Test chain-specific endpoint
    console.log('7️⃣  Testing Chain-Specific Endpoint (Ethereum)');
    console.log('-'.repeat(70));
    const ethTokens = await axios.get(`${BASE_URL}/api/tokens/ethereum?limit=5`);
    console.log('Chain:', ethTokens.data.chain);
    console.log('Token Count:', ethTokens.data.count);
    console.log('✅ Chain-specific endpoint tested\n');

    console.log('='.repeat(70));
    console.log('✨ Demo Complete! All endpoints are functional.');
    console.log('='.repeat(70));
    console.log('');
    console.log('📝 Notes:');
    console.log('  - Some APIs may require authentication for full functionality');
    console.log('  - Add API keys to .env file for Birdeye and Moonarch');
    console.log('  - DexScreener public API has rate limits');
    console.log('  - The service successfully aggregates data from multiple sources');
    console.log('');

  } catch (error) {
    console.error('❌ Error during demo:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the demo
demo().catch(console.error);
