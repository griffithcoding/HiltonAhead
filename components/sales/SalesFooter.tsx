/**
 * SalesFooter — CAN-SPAM compliant email footer.
 *
 * Drop into every cold-outbound email template rendered by the sales pipeline
 * (transactional purchase confirmations use a different footer because they
 * are not subject to the same opt-out requirements).
 *
 * What CAN-SPAM requires us to include:
 *   1. A clear, conspicuous opt-out mechanism (the unsubscribe link).
 *   2. Our physical postal address.
 *   3. A statement that this is a commercial message — implicit here via
 *      the "why you got this" paragraph.
 *
 * The unsubscribeUrl prop should be built at send time with
 * signSalesUnsubscribeToken() from /api/sales-unsubscribe/route.ts and
 * pointed at /api/sales-unsubscribe?token=<token>.
 *
 * This component is a Server Component / plain function — it renders the
 * same HTML whether called from a Resend renderer, a React Server Component,
 * or a static page. No client-side JS.
 */

import { brand } from '@/data/brand';

export interface SalesFooterProps {
  /** Full URL to /api/sales-unsubscribe?token=… */
  unsubscribeUrl: string;
  /**
   * The physical postal address used for CAN-SPAM compliance.
   * Defaults to brand.contact.location which renders the island; for full
   * compliance pass a complete street address when one is registered.
   */
  addressLine?: string;
  /**
   * Optional paragraph explaining why the recipient got this email.
   * Falls back to a generic statement tied to the brand.
   */
  whyParagraph?: string;
}

export default function SalesFooter({
  unsubscribeUrl,
  addressLine,
  whyParagraph,
}: SalesFooterProps) {
  const why =
    whyParagraph ??
    `You’re receiving this because you’re on a list ${brand.legalName} compiled of travelers and local professionals who match our destination focus (Hilton Head Island and the Lowcountry). This is the first or one of a small number of emails — opt out below at any time.`;

  const address = addressLine ?? brand.contact.location;

  return (
    <table
      role="presentation"
      cellPadding={0}
      cellSpacing={0}
      style={{
        width: '100%',
        marginTop: '32px',
        borderTop: '1px solid rgba(14,42,56,0.15)',
        paddingTop: '20px',
      }}
    >
      <tbody>
        <tr>
          <td
            style={{
              fontFamily:
                "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif",
              fontSize: '11px',
              lineHeight: 1.6,
              color: '#4A5C66',
            }}
          >
            <p style={{ margin: '0 0 12px 0' }}>{why}</p>

            <p style={{ margin: '0 0 12px 0' }}>
              <a
                href={unsubscribeUrl}
                style={{
                  color: '#0F7080',
                  textDecoration: 'underline',
                  textUnderlineOffset: '2px',
                }}
              >
                Unsubscribe in one click
              </a>{' '}
              · Or reply to this email with the word UNSUBSCRIBE and we’ll
              remove you by hand.
            </p>

            <p style={{ margin: 0, color: '#6B7280' }}>
              {brand.legalName} · {address} ·{' '}
              <a
                href={`mailto:${brand.contact.email}`}
                style={{ color: '#6B7280', textDecoration: 'underline' }}
              >
                {brand.contact.email}
              </a>
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
