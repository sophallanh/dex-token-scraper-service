# DEX Token Scraper Service

An automated token scraper service that fetches new and trending token launches from multiple DEX aggregators including DexScreener, Birdeye, and Moonarch. Supports Ethereum/Uniswap, Solana/Jupiter, and BNB Chain/PancakeSwap.

## Features

- 🔄 **Multi-Source Aggregation**: Fetch tokens from DexScreener, Birdeye, and Moonarch
- ⛓️ **Multi-Chain Support**: Ethereum, Solana, and BNB Chain
- 📊 **Rich Token Data**: Price, volume, liquidity, market cap, holders, social links, and more
- 🚀 **REST API**: Easy-to-use HTTP endpoints for querying token data
- 🎯 **Advanced Filtering**: Filter for new pairs (24-48h), low holder counts, fair launches, minimum liquidity
- 🛡️ **Safety Checks**: Automatic filtering of known scam contracts and suspicious tokens
- 🔍 **Token Search**: Search for specific tokens by contract address
- 📈 **Trending & New Listings**: Get both trending tokens and new launches
- 📁 **Multiple Output Formats**: JSON and Markdown table outputs
- 🤖 **GitHub Actions**: Automated scraping every 6 hours with automatic commits
- 📤 **GitHub Integration**: Auto-commit to drip-dex-launches repository

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
git clone https://github.com/sophallanh/dex-token-scraper-service.git
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

Edit `.env` and configure your settings:
```env
# Server Configuration
PORT=3000

# API Keys - NEVER commit these to git or share publicly!
# See SECURITY.md for important security information
DEXSCREENER_API_KEY=your_dexscreener_api_key_here
BIRDEYE_API_KEY=your_birdeye_api_key_here
MOONARCH_API_KEY=your_moonarch_api_key_here

# Filtering Configuration
MAX_AGE_HOURS=48
MAX_HOLDERS=1000
MIN_LIQUIDITY_USD=5000

# Output Configuration
OUTPUT_FORMAT=both
OUTPUT_DIR=./output

# GitHub Integration for drip-dex-launches
GITHUB_ENABLED=false
GITHUB_TOKEN=your_github_token_here
GITHUB_REPO=username/drip-dex-launches
```

> **🔐 SECURITY WARNING**: Never commit API keys to git or share them publicly! See [SECURITY.md](SECURITY.md) for important security information.

> **Note**: API keys are optional but recommended for higher rate limits and full functionality.

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

### Scheduled Scraping

Run the scheduled scraper manually:
```bash
npm run build
node dist/scripts/scheduledScraper.js
```

This will:
1. Fetch tokens from all sources
2. Apply safety and filtering criteria
3. Generate JSON and Markdown outputs
4. Optionally commit to drip-dex-launches repository

## Filtering & Safety Features

### Automatic Filters

The service automatically filters tokens based on:

- **New Pairs Only**: Tokens launched within the last 24-48 hours (configurable)
- **Low Holder Count**: Tokens with fewer than 1000 holders (configurable)
- **Minimum Liquidity**: Tokens with at least $5,000 liquidity (configurable)
- **Scam Detection**: Filters out known scam contracts
- **Suspicious Patterns**: Removes tokens with extreme price volatility (>1000%)

### Token Data Fields

Each token includes:

```typescript
{
  address: string;              // Contract address
  name: string;                 // Token name
  symbol: string;               // Token symbol
  chain: 'ethereum' | 'solana' | 'bnb';
  dex: string;                  // DEX platform
  priceUsd: number;             // Current price
  priceChange24h: number;       // 24h price change %
  volume24h: number;            // 24h trading volume
  liquidity: number;            // Total liquidity
  marketCap: number;            // Market capitalization
  holders: number;              // Number of holders
  launchDate: string;           // Token launch date
  launchStatus: string;         // 'fair-launch', 'pre-launch', 'public'
  socialLinks: {                // Social media links
    twitter: string;
    telegram: string;
    website: string;
    discord: string;
  };
  isNewPair: boolean;           // Is within age threshold
  hasLowHolders: boolean;       // Below holder threshold
  isFairLaunch: boolean;        // Fair launch indicator
  passedSafetyChecks: boolean;  // Passed all safety checks
}
```

## GitHub Actions Workflow

The service includes a GitHub Actions workflow that:
- Runs automatically every 6 hours
- Fetches and filters new token launches
- Generates JSON and Markdown reports
- Commits results to drip-dex-launches repository
- Uploads artifacts for review

### Setup GitHub Actions

1. Add the following secrets to your GitHub repository:
   - `DEXSCREENER_API_KEY`
   - `BIRDEYE_API_KEY`
   - `MOONARCH_API_KEY`
   - `GH_TOKEN` (Personal Access Token with repo scope)
   - `GITHUB_REPO` (e.g., `username/drip-dex-launches`)

2. The workflow is located at `.github/workflows/scrape-tokens.yml`

3. Manually trigger: Go to Actions tab → "Token Scraper - Every 6 Hours" → Run workflow

## Output Formats

### JSON Output

Structured JSON data for programmatic access:
```json
[
  {
    "address": "0x...",
    "name": "Token Name",
    "symbol": "TKN",
    "chain": "ethereum",
    ...
  }
]
```

### Markdown Output

Human-readable tables compatible with drip-dex-launches format:

```markdown
# New Token Launches - 2024-01-13

## Summary
- Total tokens: 25
- ethereum: 10
- solana: 10
- bnb: 5

## Token Listings

| Token | Symbol | Chain | DEX | Liquidity | Holders | Launch Date | Links |
|-------|--------|-------|-----|-----------|---------|-------------|-------|
| Token A | TKA | ethereum | uniswap | $10,000 | 500 | 2024-01-13 | [DEX](link) [🌐](site) |
```

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
