# Currency Conversion Utility

This utility provides real-time currency conversion from USD to LKR for the payment gateway integration, with additional support for location-based local currency display.

## Overview

The currency conversion system automatically converts USD package prices to LKR when processing payments through the Payhere payment gateway. This ensures that users see prices in USD (for international pricing) but payments are processed in LKR (Sri Lankan Rupees) as required by the payment processor.

**NEW FEATURE**: The system now automatically detects the user's location and displays package prices in their local currency for better user experience, while maintaining LKR for payment processing.

## Files

- `currencyConverter.ts` - Core USD to LKR conversion functions
- `locationCurrency.ts` - Location detection and multi-currency conversion
- `currencyConverter.test.ts` - Unit tests for the conversion functions

## Core Functions

### `fetchUSDToLKRRate()`
Fetches the current USD to LKR exchange rate from the exchangerate-api.com API.

**Returns:** Promise<number> - Current exchange rate

**Fallback:** If the API fails, uses a fallback rate of 320 LKR per USD

### `convertUSDToLKR(usdAmount: number)`
Converts a USD amount to LKR using the current exchange rate.

**Parameters:**
- `usdAmount` - Amount in USD

**Returns:** Promise<CurrencyConversionResult> - Complete conversion details

### `getLKRAmount(usdAmount: number)`
Converts USD to LKR and returns only the converted amount.

**Parameters:**
- `usdAmount` - Amount in USD

**Returns:** Promise<number> - Amount in LKR

## Location-Based Currency Functions

### `detectUserLocation()`
Automatically detects the user's location using IP geolocation.

**Returns:** Promise<LocationInfo> - User's country and currency information

**API:** Uses ipapi.co for free IP geolocation

### `fetchUSDToCurrencyRate(targetCurrency: string)`
Fetches exchange rate from USD to any target currency.

**Parameters:**
- `targetCurrency` - Target currency code (e.g., 'EUR', 'GBP', 'CAD')

**Returns:** Promise<number> - Exchange rate

**Fallback:** Comprehensive fallback rates for 50+ currencies if API fails

### `getLocalCurrencyAmount(usdAmount: number)`
Gets the converted amount in the user's local currency based on their detected location.

**Parameters:**
- `usdAmount` - Amount in USD

**Returns:** Promise<{ localAmount: number; localCurrency: string; localSymbol: string }>

## Integration with PaymentButton

The PaymentButton component now automatically:

1. **Detects user location** using IP geolocation
2. **Shows local currency** - Displays package price in user's local currency
3. **Maintains LKR processing** - All payments are still processed in LKR
4. **Dual display** - Shows both local currency and LKR amounts
5. **Real-time rates** - Uses current exchange rates for all conversions

## Display Features

### For International Users
- **Primary display**: USD → LKR (payment processing currency)
- **Secondary display**: USD → Local Currency (user's local currency)
- **Location indicator**: Shows detected country
- **Rate information**: Displays both LKR and local currency rates

### For Sri Lankan Users
- **Primary display**: USD → LKR (payment processing currency)
- **No secondary display**: Since local currency is already LKR

## API Details

### Currency Conversion
- **Provider:** exchangerate-api.com
- **Endpoint:** https://api.exchangerate-api.com/v4/latest/USD
- **Rate Limits:** Free tier available
- **Fallback:** Hardcoded rates for 50+ currencies

### Location Detection
- **Provider:** ipapi.co
- **Endpoint:** https://ipapi.co/json/
- **Rate Limits:** Free tier available
- **Fallback:** Default to US location if detection fails

## Supported Currencies

The system supports 50+ currencies including:
- **Major currencies**: EUR, GBP, CAD, AUD, JPY, CHF
- **Asian currencies**: CNY, KRW, SGD, HKD, THB, MYR, INR, PKR
- **European currencies**: SEK, NOK, DKK, PLN, CZK, HUF, RON
- **Middle Eastern**: AED, SAR, QAR, KWD, ILS, TRY
- **African currencies**: ZAR, NGN, EGP, KES, GHS, MAD
- **Latin American**: BRL, ARS, MXN, CLP, COP, PEN
- **And many more...**

## Error Handling

- **Network failures** fall back to reasonable exchange rates
- **Invalid API responses** trigger fallback rates
- **Location detection failures** default to US location
- **All errors are logged** for debugging
- **User experience is maintained** even when services fail

## Usage Examples

### Basic LKR Conversion
```typescript
import { getLKRAmount } from '~/lib/utils/currencyConverter';

const lkrAmount = await getLKRAmount(69.0); // Enterprise package
console.log(`${lkrAmount} LKR`); // Output: 22080.00 LKR
```

### Location-Based Conversion
```typescript
import { getLocalCurrencyAmount } from '~/lib/utils/locationCurrency';

const localInfo = await getLocalCurrencyAmount(20.0); // Plus package
console.log(`${localInfo.localSymbol} ${localInfo.localAmount} ${localInfo.localCurrency}`);
// Output: € 17.00 EUR (for European users)
```

### Manual Currency Conversion
```typescript
import { convertUSDToCurrency } from '~/lib/utils/locationCurrency';

const conversion = await convertUSDToCurrency(69.0, 'EUR');
console.log(`${conversion.convertedAmount} ${conversion.convertedCurrency}`);
// Output: 58.65 EUR
```

## Testing

Run the unit tests to verify currency conversion:

```bash
npm test currencyConverter.test.ts
```

## Performance Considerations

- **Location detection** happens once per session
- **Exchange rates** are fetched fresh for each payment
- **Fallback rates** ensure fast response when APIs are slow
- **Caching** can be implemented for production use

## Security & Privacy

- **IP geolocation** only determines country/currency
- **No personal data** is collected or stored
- **All API calls** are made from the client side
- **Fallback mechanisms** ensure service reliability

## Notes

- **Payment processing** always uses LKR regardless of user location
- **Local currency display** is for user convenience only
- **Exchange rates** are real-time but may have slight delays
- **Fallback rates** are updated periodically and can be adjusted
- **Free packages** (price: 0) bypass all conversion logic
