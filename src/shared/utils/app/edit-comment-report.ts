import { editListImmutable } from "@utils/helpers";
import { CommentReportView } from "@cyberbus-net/cyberbus-js-client";

export default function editCommentReport(
  data: CommentReportView,
  reports: CommentReportView[],
): CommentReportView[] {
  return editListImmutable("comment_report", data, reports);
}
