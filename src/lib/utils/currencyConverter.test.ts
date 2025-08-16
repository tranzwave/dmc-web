import { convertUSDToLKR, getLKRAmount } from './currencyConverter';

// Mock fetch for testing
global.fetch = jest.fn();

describe('Currency Converter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should convert USD to LKR correctly', async () => {
    const mockResponse = {
      success: true,
      timestamp: 1234567890,
      base: 'USD',
      date: '2024-01-01',
      rates: {
        LKR: 320.50
      }
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await convertUSDToLKR(20.0);
    
    expect(result.originalAmount).toBe(20.0);
    expect(result.originalCurrency).toBe('USD');
    expect(result.convertedAmount).toBe(6410.00); // 20 * 320.50
    expect(result.convertedCurrency).toBe('LKR');
    expect(result.exchangeRate).toBe(320.50);
  });

  it('should return LKR amount directly', async () => {
    const mockResponse = {
      success: true,
      timestamp: 1234567890,
      base: 'USD',
      date: '2024-01-01',
      rates: {
        LKR: 320.50
      }
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await getLKRAmount(69.0);
    expect(result).toBe(22114.50); // 69 * 320.50
  });

  it('should use fallback rate when API fails', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    const result = await getLKRAmount(20.0);
    expect(result).toBe(6400.00); // 20 * 320 (fallback rate)
  });
});
