import Link from 'next/link';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import FinalCta from '@/components/sections/FinalCta';
import NewsletterSignup from '@/components/NewsletterSignup';
import CoverChapter from '@/components/stories/CoverChapter';
import BriefChapter from '@/components/stories/BriefChapter';
import SettingChapter from '@/components/stories/SettingChapter';
import MapChapter from '@/components/stories/MapChapter';
import TimelineChapter from '@/components/stories/TimelineChapter';
import NumbersChapter from '@/components/stories/NumbersChapter';
import PivotChapter from '@/components/stories/PivotChapter';
import AftermathChapter from '@/components/stories/AftermathChapter';
import { type Story, getStoriesExcept } from '@/data/stories';
import { getTripTypeBySlug, getTripTypeDisplayName } from '@/data/tripTypes';

interface Props {
  story: Story;
}

const KIND_LABEL: Record<Story['kind'], string> = {
  event: 'AN EVENT',
  stay: 'A STAY',
};

/**
 * Eight-chapter scroll-driven story renderer. Each chapter is a separately
 * composed section component; this page orchestrates order + chrome.
 */
export default function StoryPage({ story }: Props) {
  const trip = getTripTypeBySlug(story.tripType);
  const others = getStoriesExcept(story.slug);

  return (
    <>
      <div className="mx-auto max-w-[1280px] px-5">
        <Header />
        <nav
          aria-label="Breadcrumb"
          className="mt-10 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-soft"
        >
          <Link href="/" className="transition-colors hover:text-coral">
            Home
          </Link>
          <span aria-hidden="true" className="h-px w-4 bg-ocean-deep/20" />
          <Link href="/stories" className="transition-colors hover:text-coral">
            Stories
          </Link>
          <span aria-hidden="true" className="h-px w-4 bg-ocean-deep/20" />
          <span className="text-coral">
            {story.title.plain.replace(/[,.]$/, '')}
          </span>
        </nav>
      </div>

      <CoverChapter
        storyNumber={story.storyNumber}
        kindLabel={KIND_LABEL[story.kind]}
        date={story.date}
        title={story.title}
        hook={story.hook}
        cover={story.cover}
      />

      <BriefChapter
        brief={story.brief}
        pinQuote={story.pinQuote}
        pinPhoto={story.pinPhoto}
      />

      <SettingChapter settings={story.settings} intro={story.settingIntro} />

      <MapChapter
        route={story.route}
        intro={story.routeIntro}
        totalLabel={story.routeLabel}
      />

      <TimelineChapter timeline={story.timeline} />

      <NumbersChapter stats={story.stats} intro={story.statsIntro} />

      <PivotChapter
        quote={story.pivotQuote.text}
        attribution={story.pivotQuote.attribution}
        background={story.pivotBackground}
      />

      <AftermathChapter
        takeaways={story.takeaways}
        ctaHref="/itinerary"
        ctaLabel="Plan yours"
        ctaIntro={story.aftermathIntro}
        relatedTripTypePath={trip?.path}
        relatedTripTypeLabel={
          trip ? `See how we plan ${getTripTypeDisplayName(trip).toLowerCase()}` : undefined
        }
      />

      {/* Other stories cross-link rail */}
      {others.length > 0 && (
        <section className="mx-auto mt-32 max-w-[1280px] px-5 md:mt-44">
          <h2 className="display text-[26px] leading-[1.2] text-ink md:text-[32px]">
            Other{' '}
            <span className="display-italic text-coral">stories.</span>
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {others.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/stories/${s.slug}`}
                  className="group flex h-full flex-col gap-2 rounded-2xl border border-ink/15 bg-cream/40 px-6 py-5 transition-colors hover:border-coral hover:bg-cream"
                >
                  <span className="text-[10px] uppercase tracking-[0.28em] text-coral">
                    Story № {s.storyNumber} · {KIND_LABEL[s.kind]}
                  </span>
                  <span className="display mt-1 text-[20px] leading-[1.2] text-ink group-hover:text-coral md:text-[22px]">
                    {s.title.plain}{' '}
                    <span className="display-italic">{s.title.italic}</span>
                  </span>
                  <span className="line-clamp-2 text-[13.5px] leading-[1.55] text-ink-soft">
                    {s.hook}
                  </span>
                  <span className="mt-auto pt-2 text-[11px] uppercase tracking-[0.22em] text-ink-soft group-hover:text-coral">
                    Read the story →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mx-auto mt-28 max-w-[1280px] px-5">
        <NewsletterSignup variant="inline" source={`story_${story.slug}`} />
      </div>

      <FinalCta />
      <Footer />
    </>
  );
}
