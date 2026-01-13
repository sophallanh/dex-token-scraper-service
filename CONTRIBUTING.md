# Contributing to DEX Token Scraper Service

Thank you for your interest in contributing to the DEX Token Scraper Service! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/dex-token-scraper-service.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes
6. Commit your changes: `git commit -m "Add your feature"`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Create a Pull Request

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Git

### Installation

```bash
# Install dependencies
npm install

# Copy environment example
cp .env.example .env

# Build the project
npm run build

# Run in development mode
npm run dev
```

## Code Style

We use ESLint and Prettier to maintain code quality and consistency.

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

Please ensure your code passes linting and is properly formatted before submitting a PR.

## Project Structure

```
src/
├── index.ts              # Entry point and server setup
├── types/                # TypeScript type definitions
│   └── index.ts
├── scrapers/             # DEX API integrations
│   ├── dexscreener.ts   # DexScreener scraper
│   ├── birdeye.ts       # Birdeye scraper
│   ├── moonarch.ts      # Moonarch scraper (placeholder)
│   └── index.ts
├── services/             # Business logic
│   ├── tokenScraperService.ts
│   └── index.ts
└── utils/                # Utilities and Express app
    ├── app.ts           # Express routes
    ├── helpers.ts       # Helper functions
    ├── mockData.ts      # Mock data generators
    └── index.ts
```

## Adding a New DEX Integration

To add support for a new DEX aggregator:

1. **Create a new scraper file** in `src/scrapers/`:

```typescript
// src/scrapers/newdex.ts
import axios, { AxiosInstance } from 'axios';
import { TokenData, ScraperResult } from '../types';

export class NewDexScraper {
  private client: AxiosInstance;

  constructor(apiKey?: string) {
    this.client = axios.create({
      baseURL: 'https://api.newdex.com',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { 'Authorization': `Bearer ${apiKey}` }),
      },
    });
  }

  async fetchTrendingTokens(): Promise<ScraperResult> {
    // Implementation
  }

  private transformTokenData(data: any, timestamp: string): TokenData {
    // Transform API response to TokenData format
  }
}
```

2. **Export the scraper** in `src/scrapers/index.ts`
3. **Integrate into the service** in `src/services/tokenScraperService.ts`
4. **Add API endpoint** in `src/utils/app.ts`
5. **Update documentation** in README.md and API_EXAMPLES.md
6. **Add environment variable** in .env.example if needed

## Testing

### Manual Testing

Use the demo script to test all endpoints:

```bash
node demo.js
```

### Testing Individual Endpoints

```bash
# Health check
curl http://localhost:3000/health

# Demo data
curl http://localhost:3000/api/tokens/demo?count=10

# Specific source
curl http://localhost:3000/api/sources/dexscreener
```

## Commit Messages

We follow conventional commit messages:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add support for Base chain
fix: correct token address validation
docs: update API examples with new endpoint
```

## Pull Request Process

1. **Update documentation** if you're changing functionality
2. **Add/update tests** if applicable
3. **Ensure code builds** without errors: `npm run build`
4. **Lint your code**: `npm run lint`
5. **Format your code**: `npm run format`
6. **Test your changes** manually
7. **Describe your changes** clearly in the PR description
8. **Link related issues** if applicable

## Code Review

All submissions require review. We aim to:

- Provide feedback within 48 hours
- Be constructive and respectful
- Focus on code quality and maintainability
- Ensure consistency with existing patterns

## Feature Requests

Feature requests are welcome! Please:

1. Check if the feature already exists or is planned
2. Open an issue with the `enhancement` label
3. Clearly describe the feature and its benefits
4. Provide use cases if possible

## Bug Reports

When reporting bugs, please include:

1. **Description** - Clear description of the bug
2. **Steps to Reproduce** - How to reproduce the issue
3. **Expected Behavior** - What should happen
4. **Actual Behavior** - What actually happens
5. **Environment** - Node.js version, OS, etc.
6. **Logs/Screenshots** - Any relevant error messages

## Questions?

If you have questions about contributing:

- Open an issue with the `question` label
- Check existing issues for similar questions
- Review the README.md and API_EXAMPLES.md

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in:
- The project README
- Release notes for their contributions
- GitHub's contributor graph

Thank you for contributing to DEX Token Scraper Service! 🚀
