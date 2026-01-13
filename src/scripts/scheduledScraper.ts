import dotenv from 'dotenv';
import { TokenScraperService } from '../services';
import { ScraperConfig, FilterCriteria } from '../types';
import { filterTokens, enrichTokenData } from '../utils/filters';
import { saveToFile, formatAsMarkdown, formatAsJSON, generateSummary } from '../utils/formatters';
import { GitHubIntegration } from '../utils/github';

// Load environment variables
dotenv.config();

/**
 * Scheduled scraper that runs every 6 hours via GitHub Actions
 * Fetches new tokens, applies filters, and commits to drip-dex-launches repository
 */
async function runScheduledScraper() {
  console.log('='.repeat(70));
  console.log('🚀 Starting Scheduled Token Scraper');
  console.log('='.repeat(70));
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log('');

  try {
    // Configuration from environment variables
    const config: ScraperConfig = {
      chains: ['ethereum', 'solana', 'bnb'],
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
        repo: process.env.GITHUB_REPO || 'username/drip-dex-launches',
      },
    };

    console.log('📋 Configuration:');
    console.log(`  - Chains: ${config.chains.join(', ')}`);
    console.log(`  - Max Age: ${config.filters?.maxAgeHours}h`);
    console.log(`  - Max Holders: ${config.filters?.maxHolders}`);
    console.log(`  - Min Liquidity: $${config.filters?.minLiquidity}`);
    console.log(`  - Output Format: ${config.outputFormat}`);
    console.log(`  - GitHub Integration: ${config.githubIntegration?.enabled ? '✓' : '✗'}`);
    console.log('');

    // Initialize scraper service
    const scraperService = new TokenScraperService(config);

    // Fetch all tokens
    console.log('🔍 Fetching tokens from all sources...');
    const allTokens = await scraperService.fetchAllTokens();
    console.log(`✓ Fetched ${allTokens.length} total tokens`);
    console.log('');

    // Apply filters
    console.log('🔧 Applying filters...');
    const filterCriteria: FilterCriteria = {
      newPairsOnly: true,
      maxAgeHours: config.filters?.maxAgeHours,
      maxHolders: config.filters?.maxHolders,
      minLiquidity: config.filters?.minLiquidity,
      excludeScams: true,
    };

    // Enrich tokens with metadata
    const enrichedTokens = allTokens.map(token => enrichTokenData(token, filterCriteria));
    
    // Filter tokens
    const filteredTokens = filterTokens(enrichedTokens, filterCriteria);
    const uniqueTokens = scraperService.removeDuplicates(filteredTokens);
    const sortedTokens = scraperService.sortTokens(uniqueTokens, 'volume');

    console.log(`✓ ${filteredTokens.length} tokens passed filters`);
    console.log(`✓ ${uniqueTokens.length} unique tokens after deduplication`);
    console.log('');

    // Generate summary
    console.log(generateSummary(sortedTokens));
    console.log('');

    // Save to local files
    const outputDir = process.env.OUTPUT_DIR || './output';
    const savedFiles: string[] = [];

    if (config.outputFormat === 'json' || config.outputFormat === 'both') {
      console.log('💾 Saving JSON output...');
      const jsonPath = await saveToFile(sortedTokens, 'json', outputDir);
      console.log(`✓ Saved to: ${jsonPath}`);
      savedFiles.push(jsonPath);
    }

    if (config.outputFormat === 'markdown' || config.outputFormat === 'both') {
      console.log('💾 Saving Markdown output...');
      const mdPath = await saveToFile(sortedTokens, 'markdown', outputDir);
      console.log(`✓ Saved to: ${mdPath}`);
      savedFiles.push(mdPath);
    }
    console.log('');

    // Commit to GitHub if enabled
    if (config.githubIntegration?.enabled && config.githubIntegration.token && config.githubIntegration.repo) {
      console.log('📤 Committing to GitHub repository...');
      
      try {
        const github = new GitHubIntegration({
          token: config.githubIntegration.token,
          repo: config.githubIntegration.repo,
        });

        // Test connection
        const isConnected = await github.testConnection();
        if (!isConnected) {
          throw new Error('Failed to connect to GitHub repository');
        }

        // Prepare files for commit
        const timestamp = new Date().toISOString().split('T')[0];
        const files = [
          {
            path: `launches/${timestamp}.md`,
            content: formatAsMarkdown(sortedTokens),
          },
          {
            path: `data/${timestamp}.json`,
            content: formatAsJSON(sortedTokens),
          },
        ];

        // Commit to repository
        const result = await github.commitMultipleFiles(
          files,
          `🤖 Automated token update - ${timestamp}\n\nFound ${sortedTokens.length} new tokens matching criteria`,
          'main'
        );

        if (result.success) {
          console.log(`✓ Successfully committed to ${config.githubIntegration.repo}`);
          console.log(`  Commit SHA: ${result.sha}`);
          if (result.url) {
            console.log(`  URL: ${result.url}`);
          }
        } else {
          console.error(`✗ Failed to commit: ${result.error}`);
        }
      } catch (error) {
        console.error('✗ GitHub integration error:', error);
        console.log('  Continuing without GitHub commit...');
      }
    } else {
      console.log('ℹ️  GitHub integration disabled or not configured');
    }

    console.log('');
    console.log('='.repeat(70));
    console.log('✅ Scheduled scraper completed successfully');
    console.log('='.repeat(70));

  } catch (error) {
    console.error('');
    console.error('='.repeat(70));
    console.error('❌ Scheduled scraper failed');
    console.error('='.repeat(70));
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the scraper
runScheduledScraper().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
