# DEX Token Scraper Service

An automated token scraper service that fetches new and trending token launches from multiple DEX aggregators including DexScreener, Birdeye, and Moonarch. Supports Ethereum/Uniswap, Solana/Jupiter, and BNB Chain/PancakeSwap.

## Features

- 🔄 **Multi-Source Aggregation**: Fetch tokens from DexScreener, Birdeye, and Moonarch
- ⛓️ **Multi-Chain Support**: Ethereum, Solana, and BNB Chain
- 📊 **Rich Token Data**: Price, volume, liquidity, market cap, and more
- 🚀 **REST API**: Easy-to-use HTTP endpoints for querying token data
- 🎯 **Filtering & Sorting**: Filter by chain, sort by volume/liquidity/market cap
- 🔍 **Token Search**: Search for specific tokens by contract address
- 📈 **Trending & New Listings**: Get both trending tokens and new launches

## Supported DEX Aggregators

| Aggregator | Chains | Features |
|------------|--------|----------|
| **DexScreener** | Ethereum, Solana, BNB | Trending tokens, token search |
| **Birdeye** | Solana | Trending tokens, new listings, token overview |
| **Moonarch** | Multi-chain | Trending tokens, new launches |

## Installation

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd dex-token-scraper-service
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
```env
PORT=3000
BIRDEYE_API_KEY=your_birdeye_api_key_here
MOONARCH_API_KEY=your_moonarch_api_key_here
FETCH_INTERVAL_MS=60000
```

> **Note**: DexScreener doesn't require an API key for basic usage. Birdeye and Moonarch API keys are optional but recommended for higher rate limits.

## Usage

### Development Mode

```bash
npm run dev
```

### Production Mode

Build the project:
```bash
npm run build
```

Start the server:
```bash
npm start
```

The service will be available at `http://localhost:3000`

## API Endpoints

### 1. Service Information
```http
GET /
```
Returns service documentation and available endpoints.

### 2. Health Check
```http
GET /health
```
Returns service health status.

### 3. Get All Tokens
```http
GET /api/tokens?sortBy=volume&limit=100
```
Fetches tokens from all sources.

**Query Parameters:**
- `sortBy`: `volume` | `liquidity` | `marketCap` | `priceChange` (default: `volume`)
- `limit`: Number of tokens to return (default: `100`)

**Response:**
```json
{
  "success": true,
  "count": 100,
  "tokens": [...],
  "stats": {
    "total": 100,
    "byChain": { "ethereum": 40, "solana": 40, "bnb": 20 },
    "bySource": { "dexscreener": 60, "birdeye": 40 },
    "totalVolume": 1000000,
    "totalLiquidity": 5000000
  },
  "timestamp": "2024-01-13T00:00:00.000Z"
}
```

### 4. Get Tokens by Chain
```http
GET /api/tokens/:chain?sortBy=volume&limit=50
```
Fetches tokens for a specific chain.

**Supported Chains:** `ethereum`, `solana`, `bnb`

### 5. Get Tokens from DexScreener
```http
GET /api/sources/dexscreener
```
Fetches trending tokens from DexScreener only.

### 6. Get Tokens from Birdeye
```http
GET /api/sources/birdeye
```
Fetches trending and new listing tokens from Birdeye (Solana).

### 7. Get Tokens from Moonarch
```http
GET /api/sources/moonarch
```
Fetches tokens from Moonarch.

### 8. Get Token by Address
```http
GET /api/token/:address
```
Fetches detailed information for a specific token by contract address.

**Example:**
```http
GET /api/token/0x1234567890abcdef1234567890abcdef12345678
```

## Token Data Structure

Each token object contains:

```typescript
{
  address: string;           // Contract address
  name: string;              // Token name
  symbol: string;            // Token symbol
  chain: 'ethereum' | 'solana' | 'bnb';
  dex: string;              // DEX name (e.g., 'uniswap', 'jupiter')
  priceUsd: number;         // Current price in USD
  priceChange24h: number;   // 24h price change percentage
  volume24h: number;        // 24h trading volume
  liquidity: number;        // Total liquidity
  marketCap: number;        // Market capitalization
  holders: number;          // Number of holders (if available)
  createdAt: string;        // Token creation date
  pairAddress: string;      // Trading pair address
  url: string;              // Link to DEX page
  source: string;           // Data source
  scrapedAt: string;        // Timestamp when data was fetched
}
```

## Examples

### Fetch Top 10 Ethereum Tokens by Volume
```bash
curl "http://localhost:3000/api/tokens/ethereum?sortBy=volume&limit=10"
```

### Fetch New Solana Listings
```bash
curl "http://localhost:3000/api/sources/birdeye"
```

### Search for a Specific Token
```bash
curl "http://localhost:3000/api/token/0x1234567890abcdef1234567890abcdef12345678"
```

## Development

### Project Structure
```
src/
├── index.ts              # Entry point
├── types/                # TypeScript type definitions
│   └── index.ts
├── scrapers/             # DEX scraper implementations
│   ├── dexscreener.ts
│   ├── birdeye.ts
│   ├── moonarch.ts
│   └── index.ts
├── services/             # Business logic
│   ├── tokenScraperService.ts
│   └── index.ts
└── utils/                # Utilities and Express app
    ├── app.ts
    ├── helpers.ts
    └── index.ts
```

### Code Quality

Lint the code:
```bash
npm run lint
```

Format the code:
```bash
npm run format
```

### Build
```bash
npm run build
```

## API Rate Limits

- **DexScreener**: No API key required, public endpoints available
- **Birdeye**: Requires API key for production use, rate limits vary by plan
- **Moonarch**: Check their documentation for rate limits

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or contributions, please open an issue on GitHub.

## Acknowledgments

- [DexScreener API](https://docs.dexscreener.com/)
- [Birdeye API](https://docs.birdeye.so/)
- Built with TypeScript, Express, and Axios
