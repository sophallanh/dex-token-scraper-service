import { TokenData } from '../types';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Format tokens as JSON
 */
export function formatAsJSON(tokens: TokenData[]): string {
  return JSON.stringify(tokens, null, 2);
}

/**
 * Format tokens as markdown table compatible with drip-dex-launches format
 */
export function formatAsMarkdown(tokens: TokenData[]): string {
  if (tokens.length === 0) {
    return '# No tokens found\n';
  }

  const timestamp = new Date().toISOString().split('T')[0];
  let markdown = `# New Token Launches - ${timestamp}\n\n`;
  markdown += `> Last updated: ${new Date().toISOString()}\n\n`;
  markdown += `## Summary\n\n`;
  markdown += `- Total tokens: ${tokens.length}\n`;
  
  // Count by chain
  const byChain: Record<string, number> = {};
  tokens.forEach(token => {
    byChain[token.chain] = (byChain[token.chain] || 0) + 1;
  });
  
  Object.entries(byChain).forEach(([chain, count]) => {
    markdown += `- ${chain}: ${count}\n`;
  });

  markdown += `\n## Token Listings\n\n`;
  markdown += `| Token | Symbol | Chain | DEX | Liquidity | Holders | Launch Date | Links |\n`;
  markdown += `|-------|--------|-------|-----|-----------|---------|-------------|-------|\n`;

  tokens.forEach(token => {
    const liquidity = token.liquidity ? `$${token.liquidity.toLocaleString()}` : 'N/A';
    const holders = token.holders !== undefined ? token.holders.toLocaleString() : 'N/A';
    const launchDate = token.launchDate || token.createdAt || 'Unknown';
    
    let links = '';
    if (token.url) {
      links += `[DEX](${token.url})`;
    }
    if (token.socialLinks?.website) {
      links += ` [🌐](${token.socialLinks.website})`;
    }
    if (token.socialLinks?.twitter) {
      links += ` [🐦](${token.socialLinks.twitter})`;
    }
    if (token.socialLinks?.telegram) {
      links += ` [💬](${token.socialLinks.telegram})`;
    }

    markdown += `| ${token.name} | ${token.symbol} | ${token.chain} | ${token.dex} | ${liquidity} | ${holders} | ${launchDate.split('T')[0]} | ${links} |\n`;
  });

  // Add safety notice
  markdown += `\n## Safety Notice\n\n`;
  markdown += `⚠️ **DYOR (Do Your Own Research)**: Always verify token contracts and do thorough research before investing.\n\n`;
  markdown += `- Check contract addresses on blockchain explorers\n`;
  markdown += `- Verify social links and project legitimacy\n`;
  markdown += `- Be cautious of tokens with very low liquidity or holders\n`;
  markdown += `- Never invest more than you can afford to lose\n\n`;

  markdown += `---\n\n`;
  markdown += `*Data sourced from DexScreener, Birdeye, and other DEX aggregators*\n`;

  return markdown;
}

/**
 * Save tokens to file in specified format
 */
export async function saveToFile(
  tokens: TokenData[],
  format: 'json' | 'markdown',
  outputDir: string = './output'
): Promise<string> {
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  const filename = format === 'json' 
    ? `tokens-${timestamp}.json`
    : `tokens-${timestamp}.md`;
  
  const filepath = path.join(outputDir, filename);
  
  const content = format === 'json' 
    ? formatAsJSON(tokens)
    : formatAsMarkdown(tokens);

  fs.writeFileSync(filepath, content, 'utf-8');
  
  return filepath;
}

/**
 * Format tokens by chain for organized output
 */
export function formatByChain(tokens: TokenData[]): Record<string, TokenData[]> {
  const byChain: Record<string, TokenData[]> = {
    ethereum: [],
    solana: [],
    bnb: [],
  };

  tokens.forEach(token => {
    if (byChain[token.chain]) {
      byChain[token.chain].push(token);
    }
  });

  return byChain;
}

/**
 * Generate summary statistics for tokens
 */
export function generateSummary(tokens: TokenData[]): string {
  const total = tokens.length;
  const newPairs = tokens.filter(t => t.isNewPair).length;
  const lowHolders = tokens.filter(t => t.hasLowHolders).length;
  const fairLaunches = tokens.filter(t => t.isFairLaunch).length;
  const safeTokens = tokens.filter(t => t.passedSafetyChecks).length;

  const totalLiquidity = tokens.reduce((sum, t) => sum + (t.liquidity || 0), 0);
  const avgLiquidity = total > 0 ? totalLiquidity / total : 0;

  return `
Summary Statistics:
- Total Tokens: ${total}
- New Pairs (< 48h): ${newPairs}
- Low Holder Count: ${lowHolders}
- Fair Launches: ${fairLaunches}
- Passed Safety Checks: ${safeTokens}
- Total Liquidity: $${totalLiquidity.toLocaleString()}
- Average Liquidity: $${avgLiquidity.toLocaleString()}
  `.trim();
}
