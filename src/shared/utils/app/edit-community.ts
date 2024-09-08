import { editListImmutable } from "@utils/helpers";
import { CommunityView } from "@cyberbus-net/cyberbus-js-client";

export default function editCommunity(
  data: CommunityView,
  communities: CommunityView[],
): CommunityView[] {
  return editListImmutable("community", data, communities);
}
