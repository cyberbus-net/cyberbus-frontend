import { communitySelectName } from "@utils/app";
import { Choice } from "@utils/types";
import { CommunityView } from "@cyberbus-net/cyberbus-js-client";

export default function communityToChoice(cv: CommunityView): Choice {
  return {
    value: cv.community.id.toString(),
    label: communitySelectName(cv),
  };
}
