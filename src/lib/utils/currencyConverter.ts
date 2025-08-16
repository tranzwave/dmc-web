export interface ExchangeRateResponse {
  success: boolean;
  timestamp: number;
  base: string;
  date: string;
  rates: {
    LKR: number;
  };
}

export interface CurrencyConversionResult {
  originalAmount: number;
  originalCurrency: string;
  convertedAmount: number;
  convertedCurrency: string;
  exchangeRate: number;
  timestamp: number;
}

/**
 * Fetches the current USD to LKR exchange rate from a free API
 * @returns Promise<number> - The current exchange rate
 */
export async function fetchUSDToLKRRate(): Promise<number> {
  try {
    // Using exchangerate-api.com (free tier, no API key required)
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rate: ${response.status}`);
    }
    
    const data: ExchangeRateResponse = await response.json();
    
    if (!data.success && !data.rates?.LKR) {
      throw new Error('Invalid exchange rate data received');
    }
    
    return data.rates.LKR;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    
    // Fallback to a reasonable exchange rate if API fails
    // You can update this fallback rate as needed
    const fallbackRate = 320; // Approximate USD to LKR rate
    console.warn(`Using fallback exchange rate: ${fallbackRate}`);
    
    return fallbackRate;
  }
}

/**
 * Converts USD amount to LKR using current exchange rate
 * @param usdAmount - Amount in USD
 * @returns Promise<CurrencyConversionResult> - Conversion result with details
 */
export async function convertUSDToLKR(usdAmount: number): Promise<CurrencyConversionResult> {
  const exchangeRate = await fetchUSDToLKRRate();
  const convertedAmount = usdAmount * exchangeRate;
  
  return {
    originalAmount: usdAmount,
    originalCurrency: 'USD',
    convertedAmount: Number(convertedAmount.toFixed(2)),
    convertedCurrency: 'LKR',
    exchangeRate,
    timestamp: Date.now()
  };
}

/**
 * Converts USD amount to LKR and returns only the converted amount
 * @param usdAmount - Amount in USD
 * @returns Promise<number> - Amount in LKR
 */
export async function getLKRAmount(usdAmount: number): Promise<number> {
  const conversion = await convertUSDToLKR(usdAmount);
  return conversion.convertedAmount;
}
