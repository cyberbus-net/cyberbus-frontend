import { editListImmutable } from "@utils/helpers";
import { PrivateMessageView } from "@cyberbus-net/cyberbus-js-client";

export default function editPrivateMessage(
  data: PrivateMessageView,
  messages: PrivateMessageView[],
): PrivateMessageView[] {
  return editListImmutable("private_message", data, messages);
}
