import { GetSiteResponse } from "@cyberbus-net/cyberbus-js-client";

export default function enableDownvotes(siteRes: GetSiteResponse): boolean {
  return siteRes.site_view.local_site.enable_downvotes;
}
