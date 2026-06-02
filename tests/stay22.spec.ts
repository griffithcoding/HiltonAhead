import { test, expect } from '@playwright/test';
import {
  withStay22Params,
  stay22MapEmbedSrc,
  stay22SearchDeeplink,
  STAY22_AID,
} from '../app/lib/stay22';

test.describe('stay22 helpers', () => {
  test('withStay22Params stamps aid on a clean url', () => {
    const out = withStay22Params('https://www.booking.com/x.html');
    expect(out).toContain('aid=');
    expect(out).toContain('booking.com');
  });

  test('withStay22Params does not double-stamp', () => {
    const once = withStay22Params('https://www.booking.com/x.html');
    const twice = withStay22Params(once);
    expect((twice.match(/aid=/g) || []).length).toBe(1);
  });

  test('withStay22Params returns input unchanged when malformed', () => {
    expect(withStay22Params('not a url')).toBe('not a url');
  });

  test('stay22MapEmbedSrc builds an embed url with lat/lng/aid', () => {
    const src = stay22MapEmbedSrc({ lat: 32.134, lng: -80.808, zoom: 13 });
    expect(src).toContain('lat=32.134');
    expect(src).toContain('lng=-80.808');
    expect(src).toContain(`aid=${STAY22_AID}`);
  });

  test('stay22SearchDeeplink merges params', () => {
    const url = stay22SearchDeeplink(
      { lat: 32.134, lng: -80.808 },
      { adults: 4, query: 'oceanfront' },
    );
    expect(url).toContain('adults=4');
    expect(url).toContain('oceanfront');
  });
});
