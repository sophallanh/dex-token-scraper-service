# API Examples

This document provides detailed examples of using the DEX Token Scraper Service API.

## Base URL

```
http://localhost:3000
```

## Authentication

Currently, no authentication is required for the service endpoints. However, individual DEX aggregator APIs (Birdeye, Moonarch) may require API keys configured in your `.env` file.

## Examples

### 1. Get Service Health

Check if the service is running:

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-13T00:00:00.000Z",
  "service": "dex-token-scraper-service"
}
```

### 2. Get Demo Tokens

Get mock token data for testing:

```bash
curl http://localhost:3000/api/tokens/demo?count=5
```

Response includes:
- Mock token data with realistic values
- Statistics by chain and source
- Note about demo mode

### 3. Get All Tokens

Fetch tokens from all configured sources:

```bash
# Get top 20 tokens sorted by volume
curl "http://localhost:3000/api/tokens?limit=20&sortBy=volume"

# Get top 50 tokens sorted by liquidity
curl "http://localhost:3000/api/tokens?limit=50&sortBy=liquidity"

# Get top 100 tokens sorted by market cap
curl "http://localhost:3000/api/tokens?limit=100&sortBy=marketCap"
```

Available `sortBy` options:
- `volume` - 24h trading volume (default)
- `liquidity` - Total liquidity
- `marketCap` - Market capitalization
- `priceChange` - 24h price change percentage

### 4. Get Tokens by Chain

Fetch tokens for a specific blockchain:

```bash
# Ethereum tokens
curl "http://localhost:3000/api/tokens/ethereum?limit=30"

# Solana tokens
curl "http://localhost:3000/api/tokens/solana?limit=30"

# BNB Chain tokens
curl "http://localhost:3000/api/tokens/bnb?limit=30"
```

### 5. Get Tokens from Specific Source

#### DexScreener

```bash
curl http://localhost:3000/api/sources/dexscreener
```

#### Birdeye (Solana)

```bash
curl http://localhost:3000/api/sources/birdeye
```

Response includes both trending tokens and new listings:
```json
{
  "success": true,
  "source": "birdeye",
  "trending": {
    "count": 50,
    "tokens": [...]
  },
  "newListings": {
    "count": 50,
    "tokens": [...]
  }
}
```

#### Moonarch

```bash
curl http://localhost:3000/api/sources/moonarch
```

### 6. Get Token by Address

Look up a specific token by its contract address:

```bash
# Ethereum token (WETH)
curl http://localhost:3000/api/token/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2

# Solana token (SOL)
curl http://localhost:3000/api/token/So11111111111111111111111111111111111111112
```

## Response Format

### Token Object

Each token in the response contains:

```json
{
  "address": "0x...",
  "name": "Token Name",
  "symbol": "SYMBOL",
  "chain": "ethereum|solana|bnb",
  "dex": "uniswap|jupiter|pancakeswap",
  "priceUsd": 1.25,
  "priceChange24h": 15.5,
  "volume24h": 1500000,
  "liquidity": 5000000,
  "marketCap": 50000000,
  "holders": 15000,
  "pairAddress": "0x...",
  "url": "https://...",
  "source": "dexscreener|birdeye|moonarch",
  "scrapedAt": "2024-01-13T00:00:00.000Z"
}
```

### Statistics Object

Aggregated data responses include statistics:

```json
{
  "stats": {
    "total": 100,
    "byChain": {
      "ethereum": 40,
      "solana": 40,
      "bnb": 20
    },
    "bySource": {
      "dexscreener": 60,
      "birdeye": 40
    },
    "totalVolume": 1000000,
    "totalLiquidity": 5000000
  }
}
```

## Using with JavaScript/Node.js

```javascript
const axios = require('axios');

async function getTopTokens() {
  try {
    const response = await axios.get('http://localhost:3000/api/tokens', {
      params: {
        limit: 10,
        sortBy: 'volume'
      }
    });
    
    console.log(`Found ${response.data.count} tokens`);
    response.data.tokens.forEach(token => {
      console.log(`${token.symbol}: $${token.priceUsd} (${token.chain})`);
    });
  } catch (error) {
    console.error('Error fetching tokens:', error.message);
  }
}

getTopTokens();
```

## Using with Python

```python
import requests

def get_top_tokens():
    try:
        response = requests.get('http://localhost:3000/api/tokens', params={
            'limit': 10,
            'sortBy': 'volume'
        })
        data = response.json()
        
        print(f"Found {data['count']} tokens")
        for token in data['tokens']:
            print(f"{token['symbol']}: ${token['priceUsd']} ({token['chain']})")
    except Exception as e:
        print(f"Error fetching tokens: {e}")

get_top_tokens()
```

## Using with cURL and jq

Pretty print JSON responses:

```bash
curl -s http://localhost:3000/api/tokens?limit=5 | jq '.'
```

Extract specific fields:

```bash
# Get just token symbols and prices
curl -s http://localhost:3000/api/tokens?limit=10 | jq '.tokens[] | {symbol, priceUsd, chain}'

# Get total volume
curl -s http://localhost:3000/api/tokens | jq '.stats.totalVolume'

# Count tokens by chain
curl -s http://localhost:3000/api/tokens | jq '.stats.byChain'
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200 OK` - Request successful
- `400 Bad Request` - Invalid parameters (e.g., invalid chain name)
- `500 Internal Server Error` - Server error

Error response format:
```json
{
  "success": false,
  "error": "Error message description"
}
```

## Rate Limiting

The service itself doesn't impose rate limits, but be aware that:

- DexScreener public API has rate limits
- Birdeye requires API key for higher limits
- Moonarch API limits depend on your subscription

Consider implementing caching on the client side if making frequent requests.

## Best Practices

1. **Use the demo endpoint** for testing without hitting real APIs
2. **Implement caching** to reduce API calls
3. **Handle errors gracefully** - API sources may be unavailable
4. **Use appropriate limits** - Don't fetch more data than you need
5. **Configure API keys** in production for better rate limits
