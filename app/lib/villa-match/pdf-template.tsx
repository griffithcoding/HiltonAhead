// app/lib/villa-match/pdf-template.tsx
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import type { QuizAnswers } from '@/components/villa-match/types';
import type { MatchArchetype } from '@/data/matchArchetypes';
import { neighborhoods } from '@/data/neighborhoods';
import { brand } from '@/data/brand';

const COLORS = {
  ink: '#0A2930',
  inkSoft: '#3F5A60',
  cream: '#F4ECDF',
  coral: '#D86F4F',
  border: 'rgba(10, 41, 48, 0.15)',
};

const styles = StyleSheet.create({
  page: { padding: 48, fontSize: 11, color: COLORS.ink, fontFamily: 'Helvetica' },
  header: { borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingBottom: 14, marginBottom: 22 },
  brand: { fontSize: 10, letterSpacing: 2, color: COLORS.inkSoft, textTransform: 'uppercase' },
  title: { fontSize: 24, marginTop: 4, fontFamily: 'Helvetica-Bold' },
  eyebrow: { fontSize: 9, letterSpacing: 1.5, color: COLORS.coral, textTransform: 'uppercase', marginBottom: 4 },
  headline: { fontSize: 18, fontFamily: 'Helvetica-Bold', marginBottom: 12 },
  body: { fontSize: 11, lineHeight: 1.6, color: COLORS.inkSoft, marginBottom: 14 },
  section: { marginTop: 18, paddingTop: 12, borderTopWidth: 1, borderTopColor: COLORS.border },
  alts: { marginTop: 22, padding: 14, backgroundColor: COLORS.cream },
  altLine: { fontSize: 10, marginBottom: 4 },
  footer: {
    position: 'absolute',
    bottom: 36,
    left: 48,
    right: 48,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
    fontSize: 9,
    color: COLORS.inkSoft,
  },
});

export type VillaMatchPdfProps = {
  answers: QuizAnswers;
  topMatch: MatchArchetype;
  alts: MatchArchetype[];
};

export function VillaMatchPdfDocument({ topMatch, alts }: VillaMatchPdfProps) {
  const neighborhood = neighborhoods.find((n) => n.slug === topMatch.neighborhoodSlug);
  const properties = (neighborhood?.properties ?? []).slice(0, 3);

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>{brand.name}</Text>
          <Text style={styles.title}>Your Villa Match</Text>
        </View>

        <Text style={styles.eyebrow}>Your best match</Text>
        <Text style={styles.headline}>{topMatch.headline}</Text>

        <Text style={styles.body}>{topMatch.whyItFits}</Text>

        {properties.length > 0 && (
          <View>
            <Text style={[styles.eyebrow, { color: COLORS.inkSoft }]}>Buildings we&apos;d shortlist</Text>
            {properties.map((p) => (
              <Text key={p.name} style={styles.altLine}>
                {p.name} — {p.note}
              </Text>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.eyebrow, { color: COLORS.inkSoft }]}>What to watch out for</Text>
          <Text style={styles.body}>{topMatch.whatToWatchOut}</Text>
        </View>

        {alts.length > 0 && (
          <View style={styles.alts}>
            <Text style={[styles.eyebrow, { color: COLORS.inkSoft }]}>Or, depending on the week</Text>
            {alts.map((a) => {
              const altN = neighborhoods.find((n) => n.slug === a.neighborhoodSlug);
              return (
                <Text key={a.id} style={styles.altLine}>
                  {a.headline} · {altN?.name ?? ''}
                </Text>
              );
            })}
          </View>
        )}

        <View style={styles.footer}>
          <Text>
            {brand.contact.email}
            {brand.scheduling.calendly.url ? `  ·  ${brand.scheduling.calendly.url}` : ''}
            {brand.url ? `  ·  ${brand.url}` : ''}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
