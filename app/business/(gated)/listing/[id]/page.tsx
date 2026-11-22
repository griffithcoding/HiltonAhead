import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import { SectionHead } from '@/components/ui/Ornament';
import { requireBusinessOwner } from '@/utils/supabase/businessOwner';
import { generatePageMetadata } from '@/app/lib/metadata';
import { getOwnedListing } from '@/app/lib/businessPortal';
import ListingEditForm from '@/components/business/ListingEditForm';

export const metadata: Metadata = generatePageMetadata({
  title: 'Edit Listing',
  description: 'Update your Hilton Ahead listing details.',
  path: '/business',
  noindex: true,
});

export const dynamic = 'force-dynamic';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const auth = await requireBusinessOwner();
  if (!auth.ok || !auth.businesses.some((b) => b.business_id === id)) notFound();

  const listing = await getOwnedListing(id);
  if (!listing) notFound();

  return (
    <div className="mx-auto max-w-[1280px] px-5">
      <Header />

      <section className="mx-auto mt-12 max-w-[760px] pb-20 md:mt-16">
        <Link
          href="/business"
          className="link-underline text-[13px] text-ink-soft hover:text-ink"
        >
          ← Back to portal
        </Link>

        <div className="mt-8">
          <SectionHead
            number="№ 01"
            eyebrow="Edit listing"
            plain={listing.name}
            italic="Keep the details current."
          />
        </div>
        <p className="mt-6 text-[15px] leading-[1.7] text-ink-soft">
          These are the facts travelers rely on. Our editorial review, photos
          and category placement are managed by the Hilton Ahead team — email
          us if any of those need a change.
        </p>

        <div className="mt-10">
          <ListingEditForm
            initial={{
              businessId: listing.id,
              name: listing.name,
              tagline: listing.tagline ?? '',
              address: listing.address ?? '',
              city: listing.city ?? '',
              phone: listing.phone ?? '',
              website: listing.website ?? '',
              hours: listing.hours ?? '',
              instagram: listing.instagram ?? '',
              facebook: listing.facebook ?? '',
              parking: listing.parking ?? '',
              dressCode: listing.dress_code ?? '',
              petFriendly:
                listing.pet_friendly === true
                  ? 'yes'
                  : listing.pet_friendly === false
                    ? 'no'
                    : '',
            }}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}
