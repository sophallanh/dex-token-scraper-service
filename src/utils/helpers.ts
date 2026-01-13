/**
 * Format number with commas for better readability
 */
export function formatNumber(num: number | undefined): string {
  if (num === undefined || num === null) return 'N/A';
  return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

/**
 * Format currency with $ sign
 */
export function formatCurrency(num: number | undefined): string {
  if (num === undefined || num === null) return 'N/A';
  return `$${formatNumber(num)}`;
}

/**
 * Format percentage
 */
export function formatPercentage(num: number | undefined): string {
  if (num === undefined || num === null) return 'N/A';
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
}

/**
 * Delay execution for specified milliseconds
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Truncate string to specified length
 */
export function truncate(str: string, length: number = 50): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
}

/**
 * Validate Ethereum address
 */
export function isValidEthAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate Solana address
 */
export function isValidSolAddress(address: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}
