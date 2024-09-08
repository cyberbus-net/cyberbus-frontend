import { editListImmutable } from "@utils/helpers";
import { PrivateMessageReportView } from "@cyberbus-net/cyberbus-js-client";

export default function editPrivateMessageReport(
  data: PrivateMessageReportView,
  reports: PrivateMessageReportView[],
): PrivateMessageReportView[] {
  return editListImmutable("private_message_report", data, reports);
}
