# Currency Conversion Utility

This utility provides real-time currency conversion from USD to LKR for the payment gateway integration.

## Overview

The currency conversion system automatically converts USD package prices to LKR when processing payments through the Payhere payment gateway. This ensures that users see prices in USD (for international pricing) but payments are processed in LKR (Sri Lankan Rupees) as required by the payment processor.

## Files

- `currencyConverter.ts` - Main utility functions for currency conversion
- `currencyConverter.test.ts` - Unit tests for the conversion functions

## Functions

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

## Integration with PaymentButton

The PaymentButton component automatically:

1. Checks if the selected package is priced in USD
2. Converts the USD amount to LKR using real-time exchange rates
3. Displays the converted amount to the user
4. Sends the LKR amount to the payment gateway
5. Generates the payment hash using the LKR amount

## API Details

- **Provider:** exchangerate-api.com
- **Endpoint:** https://api.exchangerate-api.com/v4/latest/USD
- **Rate Limits:** Free tier available
- **Fallback:** Hardcoded rate of 320 LKR/USD if API fails

## Error Handling

- Network failures fall back to a reasonable exchange rate
- Invalid API responses trigger fallback
- All errors are logged for debugging
- User experience is maintained even when conversion fails

## Usage Example

```typescript
import { getLKRAmount } from '~/lib/utils/currencyConverter';

// Convert USD package price to LKR
const lkrAmount = await getLKRAmount(69.0); // Enterprise package
console.log(`${lkrAmount} LKR`); // Output: 22080.00 LKR
```

## Testing

Run the unit tests to verify currency conversion:

```bash
npm test currencyConverter.test.ts
```

## Notes

- Exchange rates are fetched fresh for each payment
- The system handles both USD and LKR packages automatically
- Free packages (price: 0) bypass conversion
- All amounts are rounded to 2 decimal places for payment processing
