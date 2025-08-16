export interface LocationInfo {
  country: string;
  countryCode: string;
  currency: string;
  currencyCode: string;
  currencySymbol: string;
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
 * Detects user's location and returns country/currency information
 * @returns Promise<LocationInfo> - User's location and currency details
 */
export async function detectUserLocation(): Promise<LocationInfo> {
  try {
    // Try to get location from IP geolocation
    const response = await fetch('https://ipapi.co/json/');
    
    if (!response.ok) {
      throw new Error(`Failed to detect location: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      country: data.country_name || 'Unknown',
      countryCode: data.country_code || 'US',
      currency: data.currency_name || 'US Dollar',
      currencyCode: data.currency || 'USD',
      currencySymbol: data.currency_symbol || '$'
    };
  } catch (error) {
    console.error('Error detecting user location:', error);
    
    // Fallback to default values
    return {
      country: 'United States',
      countryCode: 'US',
      currency: 'US Dollar',
      currencyCode: 'USD',
      currencySymbol: '$'
    };
  }
}

/**
 * Fetches exchange rate from USD to target currency
 * @param targetCurrency - Target currency code (e.g., 'EUR', 'GBP', 'CAD')
 * @returns Promise<number> - Exchange rate
 */
export async function fetchUSDToCurrencyRate(targetCurrency: string): Promise<number> {
  try {
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rate: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.rates?.[targetCurrency]) {
      throw new Error(`Exchange rate for ${targetCurrency} not found`);
    }
    
    return data.rates[targetCurrency];
  } catch (error) {
    console.error(`Error fetching ${targetCurrency} exchange rate:`, error);
    
    // Fallback rates for common currencies
    const fallbackRates: Record<string, number> = {
      'EUR': 0.85,
      'GBP': 0.73,
      'CAD': 1.25,
      'AUD': 1.35,
      'JPY': 110.0,
      'INR': 75.0,
      'SGD': 1.35,
      'HKD': 7.75,
      'CHF': 0.92,
      'SEK': 8.5,
      'NOK': 8.8,
      'DKK': 6.3,
      'PLN': 3.8,
      'CZK': 21.5,
      'HUF': 300.0,
      'RON': 4.1,
      'BGN': 1.65,
      'HRK': 6.5,
      'RUB': 75.0,
      'CNY': 6.5,
      'KRW': 1100.0,
      'THB': 32.0,
      'MYR': 4.2,
      'IDR': 14000.0,
      'PHP': 50.0,
      'VND': 23000.0,
      'BRL': 5.5,
      'ARS': 100.0,
      'CLP': 750.0,
      'COP': 3800.0,
      'MXN': 20.0,
      'PEN': 3.8,
      'UYU': 42.0,
      'ZAR': 15.0,
      'NGN': 410.0,
      'EGP': 15.5,
      'KES': 110.0,
      'GHS': 6.0,
      'MAD': 9.0,
      'TND': 2.8,
      'TRY': 8.5,
      'ILS': 3.2,
      'AED': 3.67,
      'SAR': 3.75,
      'QAR': 3.64,
      'KWD': 0.30,
      'BHD': 0.38,
      'OMR': 0.38,
      'JOD': 0.71,
      'LBP': 1500.0,
      'PKR': 160.0,
      'BDT': 85.0,
      'NPR': 120.0,
      'MMK': 1600.0,
      'LAK': 10000.0,
      'KHR': 4100.0,
      'MNT': 2850.0,
      'LKR': 320.0
    };
    
    return fallbackRates[targetCurrency] ?? 1.0;
  }
}

/**
 * Converts USD amount to target currency
 * @param usdAmount - Amount in USD
 * @param targetCurrency - Target currency code
 * @returns Promise<CurrencyConversionResult> - Conversion result
 */
export async function convertUSDToCurrency(usdAmount: number, targetCurrency: string): Promise<CurrencyConversionResult> {
  const exchangeRate = await fetchUSDToCurrencyRate(targetCurrency);
  const convertedAmount = usdAmount * exchangeRate;
  
  return {
    originalAmount: usdAmount,
    originalCurrency: 'USD',
    convertedAmount: Number(convertedAmount.toFixed(2)),
    convertedCurrency: targetCurrency,
    exchangeRate,
    timestamp: Date.now()
  };
}

/**
 * Gets the converted amount in user's local currency
 * @param usdAmount - Amount in USD
 * @returns Promise<{ localAmount: number; localCurrency: string; localSymbol: string }> - Local currency details
 */
export async function getLocalCurrencyAmount(usdAmount: number): Promise<{ localAmount: number; localCurrency: string; localSymbol: string }> {
  try {
    const location = await detectUserLocation();
    
    // If user is in Sri Lanka, return LKR
    if (location.currencyCode === 'LKR') {
      const lkrRate = await fetchUSDToCurrencyRate('LKR');
      return {
        localAmount: Number((usdAmount * lkrRate).toFixed(2)),
        localCurrency: 'LKR',
        localSymbol: 'Rs.'
      };
    }
    
    // Convert to user's local currency
    const conversion = await convertUSDToCurrency(usdAmount, location.currencyCode);
    
    return {
      localAmount: conversion.convertedAmount,
      localCurrency: location.currencyCode,
      localSymbol: location.currencySymbol
    };
  } catch (error) {
    console.error('Error getting local currency amount:', error);
    
    // Fallback to USD
    return {
      localAmount: usdAmount,
      localCurrency: 'USD',
      localSymbol: '$'
    };
  }
}
