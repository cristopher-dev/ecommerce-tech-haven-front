import { getApiBaseUrl } from '@/infrastructure/api/getApiBaseUrl';

describe('getApiBaseUrl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the module to clear cached URL
    jest.resetModules();
  });

  it('should return default URL when no environment variable is set', () => {
    const { getApiBaseUrl: getUrl } = require('@/infrastructure/api/getApiBaseUrl');
    const url = getUrl();
    
    expect(url).toBe('http://localhost:3000/api');
  });

  it('should return URL from process.env if available', () => {
    process.env.VITE_TECH_HAVEN_API_URL = 'https://api.example.com';
    
    const { getApiBaseUrl: getUrl } = require('@/infrastructure/api/getApiBaseUrl');
    const url = getUrl();
    
    expect(url).toBe('https://api.example.com');
    delete process.env.VITE_TECH_HAVEN_API_URL;
  });

  it('should return default URL as fallback', () => {
    const url = getApiBaseUrl();
    
    expect(url).toBeDefined();
    expect(typeof url).toBe('string');
    expect(url.length).toBeGreaterThan(0);
  });

  it('should cache URL and return same value on subsequent calls', () => {
    const url1 = getApiBaseUrl();
    const url2 = getApiBaseUrl();
    
    expect(url1).toBe(url2);
  });
});
