import { redirect } from 'next/navigation'

// The Featured Partner program has been retired on the front end. Any
// inbound traffic to /local/get-featured is sent to the Local Directory
// hub. Standard listing inquiries now flow through /contact.
export default function GetFeaturedPage(): never {
  redirect('/local')
}
