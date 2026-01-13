# Step-by-Step Setup Guide: API Keys & Configuration

This guide provides detailed, step-by-step instructions for obtaining all required API keys and configuring the token scraper service from start to finish.

## Table of Contents
1. [DexScreener API Key](#1-dexscreener-api-key)
2. [Birdeye API Key](#2-birdeye-api-key)
3. [Moonarch API Key](#3-moonarch-api-key)
4. [GitHub Personal Access Token (GH_TOKEN)](#4-github-personal-access-token-gh_token)
5. [GitHub Repository Configuration](#5-github-repository-configuration)
6. [Complete Setup](#6-complete-setup)

---

## 1. DexScreener API Key

### What is it?
DexScreener is a DEX aggregator that provides real-time token data across multiple blockchains.

### Do I need it?
**Optional** - DexScreener's public API works without an API key for basic usage, but an API key provides higher rate limits.

### How to get it:

#### Option A: Use without API key (Recommended for testing)
```bash
# In your .env file, leave it empty or comment it out
# DEXSCREENER_API_KEY=
```
The service will work with public rate limits.

#### Option B: Get an API key (For production)
1. **Visit**: https://dexscreener.com/
2. **Check Documentation**: Go to https://docs.dexscreener.com/api/reference
3. **Contact for API Access**: As of now, DexScreener doesn't have a public API key registration. You may need to:
   - Contact them via their Discord or Twitter
   - Check their documentation for updates on API key access
   - Use the public endpoints (which work well for most use cases)

**Time estimate**: N/A (public API works immediately)

---

## 2. Birdeye API Key

### What is it?
Birdeye is a Solana-focused DEX aggregator and analytics platform.

### Do I need it?
**Recommended** - Required for fetching Solana token data with higher rate limits.

### How to get it (10-15 minutes):

#### Step 1: Visit Birdeye
1. Go to https://birdeye.so/
2. Look for "API" or "Developer" section in the menu

#### Step 2: Access Developer Portal
1. Visit https://docs.birdeye.so/
2. Click on "Get API Key" or "Authentication"
3. You'll need to create an account

#### Step 3: Register/Login
1. Click "Sign Up" or "Get Started"
2. Provide your email address
3. Create a password
4. Verify your email (check inbox/spam)

#### Step 4: Generate API Key
1. Log in to your Birdeye account
2. Navigate to Dashboard or API Settings
3. Click "Create API Key" or "Generate New Key"
4. Copy your API key (starts with a long string of characters)
5. **IMPORTANT**: Save this key securely - you may not be able to see it again

#### Step 5: Check Rate Limits
- Free tier: ~100-1000 requests per day
- Paid tiers available for higher limits
- Check current pricing at https://docs.birdeye.so/docs/authentication-api-keys

**Example API Key format**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**Time estimate**: 10-15 minutes

---

## 3. Moonarch API Key

### What is it?
Moonarch is a multi-chain DEX aggregator (if available).

### Do I need it?
**Optional** - Moonarch integration is currently a placeholder template.

### How to get it:

#### Current Status
The Moonarch integration in this project is a **template/placeholder** because:
- Moonarch API documentation may not be publicly available
- API access might require special approval
- The service works without it using DexScreener and Birdeye

#### If Moonarch API becomes available:
1. Visit their official website
2. Look for "API" or "Developer" documentation
3. Follow their registration process
4. Generate an API key from their dashboard

**For now**: Leave this empty or commented out:
```bash
# MOONARCH_API_KEY=
```

**Time estimate**: N/A (optional/placeholder)

---

## 4. GitHub Personal Access Token (GH_TOKEN)

### What is it?
A Personal Access Token (PAT) allows the service to automatically commit scraped data to your GitHub repository.

### Do I need it?
**Required for automated commits** - Only if you want to auto-commit to drip-dex-launches repository.

### How to get it (5 minutes):

#### Step 1: Go to GitHub Settings
1. Log in to GitHub: https://github.com/
2. Click your profile picture (top-right corner)
3. Click "Settings"

#### Step 2: Navigate to Developer Settings
1. Scroll down in the left sidebar
2. Click "Developer settings" (at the bottom)

#### Step 3: Create Personal Access Token
1. Click "Personal access tokens" in the left sidebar
2. Click "Tokens (classic)" or "Fine-grained tokens"
3. Click "Generate new token" button
4. For classic token, click "Generate new token (classic)"

#### Step 4: Configure Token
1. **Note**: Give it a description (e.g., "DEX Token Scraper - Auto Commit")
2. **Expiration**: Choose expiration (recommended: 90 days or custom)
3. **Select scopes**: Check these boxes:
   - ✅ `repo` (Full control of private repositories)
     - This includes: `repo:status`, `repo_deployment`, `public_repo`, `repo:invite`, `security_events`
   - ✅ `workflow` (if you want to trigger workflows)

#### Step 5: Generate and Save
1. Scroll to bottom and click "Generate token"
2. **CRITICAL**: Copy the token immediately (starts with `ghp_` or `github_pat_`)
3. **You cannot see it again!** Save it securely.

**Example token format**: `ghp_1234567890abcdefghijklmnopqrstuvwxyz123456`

**Time estimate**: 5 minutes

#### Security Notes:
- Never commit tokens to code
- Store in environment variables or GitHub Secrets
- Rotate tokens periodically
- Use fine-grained tokens for better security (if available)

---

## 5. GitHub Repository Configuration

### What is it?
The target repository where scraped token data will be committed.

### How to set it up (5 minutes):

#### Option A: Use Existing Repository
If you have a `drip-dex-launches` repository:
```bash
GITHUB_REPO=yourusername/drip-dex-launches
```

#### Option B: Create New Repository (Recommended)

##### Step 1: Create Repository
1. Go to https://github.com/new
2. Repository name: `drip-dex-launches` (or your choice)
3. Description: "Automated DEX token launch tracking"
4. Choose: Public or Private
5. Check: "Add a README file"
6. Click "Create repository"

##### Step 2: Create Directory Structure
1. Clone your new repository locally:
```bash
git clone https://github.com/yourusername/drip-dex-launches.git
cd drip-dex-launches
```

2. Create directories:
```bash
mkdir launches
mkdir data
```

3. Create initial README (optional):
```bash
echo "# DEX Token Launches\n\nAutomated token launch tracking from DEX aggregators." > README.md
```

4. Commit and push:
```bash
git add .
git commit -m "Initial structure for automated token tracking"
git push
```

##### Step 3: Set Repository Value
```bash
GITHUB_REPO=yourusername/drip-dex-launches
```

**Time estimate**: 5 minutes

---

## 6. Complete Setup

### Local Development Setup (10 minutes)

#### Step 1: Clone the Token Scraper Repository
```bash
git clone https://github.com/sophallanh/dex-token-scraper-service.git
cd dex-token-scraper-service
```

#### Step 2: Install Dependencies
```bash
npm install
```

#### Step 3: Create Environment File
```bash
cp .env.example .env
```

#### Step 4: Edit .env File
Open `.env` in your text editor and add your keys:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# API Keys
DEXSCREENER_API_KEY=           # Leave empty for public access
BIRDEYE_API_KEY=eyJhbGc...     # Your Birdeye API key
MOONARCH_API_KEY=              # Leave empty (optional)

# Scraping Configuration
FETCH_INTERVAL_MS=60000

# Filtering Configuration
MAX_AGE_HOURS=48
MAX_HOLDERS=1000
MIN_LIQUIDITY_USD=5000

# Output Configuration
OUTPUT_FORMAT=both
OUTPUT_DIR=./output

# GitHub Integration (for local testing, set to false)
GITHUB_ENABLED=false
GITHUB_TOKEN=ghp_your_token_here
GITHUB_REPO=yourusername/drip-dex-launches
```

#### Step 5: Build the Project
```bash
npm run build
```

#### Step 6: Test Locally
```bash
# Start the API server
npm start

# Or run the scheduled scraper once
node dist/scripts/scheduledScraper.js
```

**Time estimate**: 10 minutes

---

### GitHub Actions Setup (5 minutes)

#### Step 1: Navigate to Repository Settings
1. Go to your token scraper repository: `https://github.com/sophallanh/dex-token-scraper-service`
2. Click "Settings" tab
3. Click "Secrets and variables" in left sidebar
4. Click "Actions"

#### Step 2: Add Secrets
Click "New repository secret" for each:

1. **Name**: `DEXSCREENER_API_KEY`
   - **Value**: (leave empty or add key if you have one)

2. **Name**: `BIRDEYE_API_KEY`
   - **Value**: `eyJhbGc...` (your Birdeye API key)

3. **Name**: `MOONARCH_API_KEY`
   - **Value**: (leave empty)

4. **Name**: `GH_TOKEN`
   - **Value**: `ghp_...` (your GitHub Personal Access Token)

5. **Name**: `GITHUB_REPO`
   - **Value**: `yourusername/drip-dex-launches`

#### Step 3: Enable GitHub Actions
1. Go to "Actions" tab in your repository
2. If prompted, click "I understand my workflows, go ahead and enable them"
3. Find the "Token Scraper - Every 6 Hours" workflow
4. Click on it to see details

#### Step 4: Test the Workflow
1. Click "Run workflow" button
2. Select branch: `main` or your branch
3. Click "Run workflow"
4. Wait a few minutes and check the results

**Time estimate**: 5 minutes

---

## Complete Timeline

| Task | Time | Running Total |
|------|------|---------------|
| DexScreener Setup | 0 min (optional) | 0 min |
| Birdeye API Key | 10-15 min | 15 min |
| Moonarch Setup | 0 min (skip) | 15 min |
| GitHub Token | 5 min | 20 min |
| GitHub Repo Setup | 5 min | 25 min |
| Local Development Setup | 10 min | 35 min |
| GitHub Actions Setup | 5 min | **40 min** |

**Total Time: ~40 minutes** (less if you already have accounts)

---

## Troubleshooting

### Common Issues

#### 1. Birdeye API Key Not Working
- Check if key is copied correctly (no extra spaces)
- Verify account is activated
- Check rate limits in Birdeye dashboard
- Try regenerating the key

#### 2. GitHub Token Permission Denied
- Ensure `repo` scope is selected
- Check token hasn't expired
- Verify repository name is correct format: `username/repo`
- Make sure token has access to target repository

#### 3. GitHub Actions Not Running
- Check if Actions are enabled in repository settings
- Verify all secrets are added correctly
- Check workflow file syntax
- Look at Action logs for specific errors

#### 4. Build Failures
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 5. API Rate Limits
- Use API keys for higher limits
- Reduce scraping frequency
- Implement caching
- Monitor API usage in provider dashboards

---

## Quick Reference Card

Save this for quick access:

```bash
# API Key Sources
DexScreener: https://dexscreener.com/ (optional)
Birdeye: https://docs.birdeye.so/ (required for Solana)
GitHub Token: https://github.com/settings/tokens
GitHub Repo: https://github.com/new

# Environment Variables
BIRDEYE_API_KEY=eyJhbGc...
GH_TOKEN=ghp_...
GITHUB_REPO=username/drip-dex-launches

# Quick Start Commands
npm install
cp .env.example .env
# Edit .env with your keys
npm run build
npm start

# Test Scraper
node dist/scripts/scheduledScraper.js

# GitHub Actions
Repository → Settings → Secrets → Actions → New secret
```

---

## Next Steps

After setup:
1. ✅ Monitor first automated run in GitHub Actions
2. ✅ Check output files in `./output/` directory
3. ✅ Verify commits to drip-dex-launches repository
4. ✅ Review logs for any errors
5. ✅ Adjust filtering parameters if needed
6. ✅ Set up notifications for workflow failures (optional)

---

## Support Resources

- **DexScreener Docs**: https://docs.dexscreener.com/api/reference
- **Birdeye Docs**: https://docs.birdeye.so/
- **GitHub Actions**: https://docs.github.com/en/actions
- **GitHub PAT**: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token

For issues with this scraper service:
- Check `README.md` for usage examples
- Review `NEW_FEATURES.md` for feature documentation
- Open an issue in the GitHub repository
