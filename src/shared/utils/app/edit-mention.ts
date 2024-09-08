import { editListImmutable } from "@utils/helpers";
import { PersonMentionView } from "@cyberbus-net/cyberbus-js-client";

export default function editMention(
  data: PersonMentionView,
  comments: PersonMentionView[],
): PersonMentionView[] {
  return editListImmutable("person_mention", data, comments);
}
