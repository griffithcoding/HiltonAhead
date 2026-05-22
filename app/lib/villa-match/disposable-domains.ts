// app/lib/villa-match/disposable-domains.ts
/**
 * Top ~30 disposable / temporary email domains.
 * Goal: filter the obvious cases without a runtime dep. This is not a
 * comprehensive list. Maintained inline; update when patterns of abuse appear.
 */

export const DISPOSABLE_DOMAINS: ReadonlySet<string> = new Set([
  'mailinator.com',
  'tempmail.com',
  'temp-mail.org',
  'guerrillamail.com',
  'guerrillamail.net',
  'sharklasers.com',
  'yopmail.com',
  '10minutemail.com',
  '10minutemail.net',
  'trashmail.com',
  'trashmail.net',
  'maildrop.cc',
  'fakeinbox.com',
  'getairmail.com',
  'mintemail.com',
  'throwawaymail.com',
  'mohmal.com',
  'getnada.com',
  'dispostable.com',
  'spambox.us',
  'mailnesia.com',
  'mytemp.email',
  'mailcatch.com',
  'inboxbear.com',
  'spam4.me',
  'temp-inbox.me',
  'tempinbox.com',
  'fake-email.com',
  'mailtemp.info',
  'tmpmail.org',
]);

export function isDisposable(email: string): boolean {
  const domain = email.toLowerCase().split('@')[1];
  if (!domain) return true;
  return DISPOSABLE_DOMAINS.has(domain);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isLikelyEmail(email: string): boolean {
  return EMAIL_RE.test(email) && !isDisposable(email);
}
