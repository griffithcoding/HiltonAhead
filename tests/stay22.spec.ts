import { test, expect } from '@playwright/test';
import {
  withStay22Params,
  stay22MapEmbedSrc,
  stay22SearchDeeplink,
  STAY22_AID,
} from '../app/lib/stay22';

/**
 * STAY22_AID is read from NEXT_PUBLIC_STAY22_AID at module load, so these
 * assertions are written to hold in both states: configured (CI/production
 * with the env var set) and unconfigured (a plain local checkout).
 *
 * When unconfigured the helpers must omit `aid` entirely rather than stamp a
 * placeholder — an unrecognized aid is never credited by Stay22 and only
 * leaks a fake id into live outbound links.
 */
test.describe('stay22 helpers', () => {
  test('withStay22Params stamps aid when configured, passes through when not', () => {
    const out = withStay22Params('https://www.booking.com/x.html');
    expect(out).toContain('booking.com');
    if (STAY22_AID) {
      expect(out).toContain(`aid=${STAY22_AID}`);
    } else {
      expect(out).not.toContain('aid=');
    }
  });

  test('withStay22Params does not double-stamp', () => {
    const once = withStay22Params('https://www.booking.com/x.html');
    const twice = withStay22Params(once);
    expect((twice.match(/aid=/g) || []).length).toBe(STAY22_AID ? 1 : 0);
  });

  test('withStay22Params returns input unchanged when malformed', () => {
    expect(withStay22Params('not a url')).toBe('not a url');
  });

  test('stay22MapEmbedSrc builds an embed url with lat/lng', () => {
    const src = stay22MapEmbedSrc({ lat: 32.134, lng: -80.808, zoom: 13 });
    expect(src).toContain('lat=32.134');
    expect(src).toContain('lng=-80.808');
    if (STAY22_AID) {
      expect(src).toContain(`aid=${STAY22_AID}`);
    } else {
      expect(src).not.toContain('aid=');
    }
  });

  test('stay22MapEmbedSrc uses zoom=13 when zoom is omitted', () => {
    const src = stay22MapEmbedSrc({ lat: 32.134, lng: -80.808 });
    expect(src).toContain('zoom=13');
  });

  test('stay22SearchDeeplink merges params', () => {
    const url = stay22SearchDeeplink(
      { lat: 32.134, lng: -80.808 },
      { adults: 4, query: 'oceanfront' },
    );
    expect(url).toContain('adults=4');
    expect(url).toContain('oceanfront');
  });

  test('never emits a placeholder aid', () => {
    const outputs = [
      withStay22Params('https://www.booking.com/x.html'),
      stay22MapEmbedSrc({ lat: 32.134, lng: -80.808 }),
      stay22SearchDeeplink({ lat: 32.134, lng: -80.808 }),
    ];
    for (const out of outputs) {
      expect(out).not.toContain('PLACEHOLDER');
      expect(out).not.toContain('aid=null');
      expect(out).not.toContain('aid=undefined');
    }
  });
});
