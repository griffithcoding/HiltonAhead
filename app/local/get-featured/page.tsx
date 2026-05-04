import { redirect } from 'next/navigation';

// The new home for "Feature Your Business" is the portal apply page.
// Any inbound traffic to /local/get-featured (including the existing
// nav link from data/nav.ts and any external bookmarks) is forwarded.
export default function GetFeaturedRedirect(): never {
  redirect('/business/apply');
}
