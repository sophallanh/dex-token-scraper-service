import { TokenData, FilterCriteria } from '../types';

/**
 * Known scam contract addresses to filter out
 * This list should be regularly updated with known malicious contracts
 */
const KNOWN_SCAM_ADDRESSES = new Set<string>([
  // Add known scam addresses here - these are examples
  '0x0000000000000000000000000000000000000000',
  // More can be added from community reports
]);

/**
 * Apply safety checks to token data
 */
export function applySafetyChecks(token: TokenData, minLiquidity: number = 5000): boolean {
  // Check if token is in known scam list
  if (KNOWN_SCAM_ADDRESSES.has(token.address.toLowerCase())) {
    return false;
  }

  // Check minimum liquidity threshold
  if (token.liquidity !== undefined && token.liquidity < minLiquidity) {
    return false;
  }

  // Check for suspicious patterns (optional)
  // - Extremely high price changes might indicate pump schemes
  if (token.priceChange24h !== undefined && Math.abs(token.priceChange24h) > 1000) {
    return false;
  }

  return true;
}

/**
 * Check if token is a new pair (within specified hours)
 */
export function isNewPair(token: TokenData, maxAgeHours: number = 48): boolean {
  if (!token.createdAt && !token.launchDate) {
    return false;
  }

  const launchTime = new Date(token.createdAt || token.launchDate!);
  const now = new Date();
  const ageHours = (now.getTime() - launchTime.getTime()) / (1000 * 60 * 60);

  return ageHours <= maxAgeHours;
}

/**
 * Check if token has low holder count
 */
export function hasLowHolders(token: TokenData, maxHolders: number = 1000): boolean {
  if (token.holders === undefined) {
    return false;
  }

  return token.holders <= maxHolders;
}

/**
 * Filter tokens based on criteria
 */
export function filterTokens(tokens: TokenData[], criteria: FilterCriteria): TokenData[] {
  return tokens.filter((token) => {
    // Apply safety checks if requested
    if (criteria.excludeScams !== false) {
      const minLiquidity = criteria.minLiquidity || 5000;
      if (!applySafetyChecks(token, minLiquidity)) {
        return false;
      }
    }

    // Filter for new pairs only
    if (criteria.newPairsOnly) {
      const maxAge = criteria.maxAgeHours || 48;
      if (!isNewPair(token, maxAge)) {
        return false;
      }
    }

    // Filter for low holder counts
    if (criteria.maxHolders !== undefined) {
      if (!hasLowHolders(token, criteria.maxHolders)) {
        return false;
      }
    }

    // Filter for minimum liquidity
    if (criteria.minLiquidity !== undefined) {
      if (token.liquidity === undefined || token.liquidity < criteria.minLiquidity) {
        return false;
      }
    }

    // Filter for fair launch only
    if (criteria.fairLaunchOnly) {
      if (token.launchStatus !== 'fair-launch') {
        return false;
      }
    }

    return true;
  });
}

/**
 * Enrich token data with filtering metadata
 */
export function enrichTokenData(token: TokenData, criteria: FilterCriteria): TokenData {
  const maxAgeHours = criteria.maxAgeHours || 48;
  const maxHolders = criteria.maxHolders || 1000;
  const minLiquidity = criteria.minLiquidity || 5000;

  return {
    ...token,
    isNewPair: isNewPair(token, maxAgeHours),
    hasLowHolders: hasLowHolders(token, maxHolders),
    isFairLaunch: token.launchStatus === 'fair-launch',
    passedSafetyChecks: applySafetyChecks(token, minLiquidity),
  };
}

/**
 * Add a known scam address to the filter list
 */
export function addScamAddress(address: string): void {
  KNOWN_SCAM_ADDRESSES.add(address.toLowerCase());
}

/**
 * Get all known scam addresses
 */
export function getScamAddresses(): string[] {
  return Array.from(KNOWN_SCAM_ADDRESSES);
}
