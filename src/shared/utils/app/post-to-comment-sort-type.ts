import { CommentSortType, SortType } from "@cyberbus-net/cyberbus-js-client";

export default function postToCommentSortType(sort: SortType): CommentSortType {
  switch (sort) {
    case "Active":
    case "Hot":
      return "Hot";
    case "New":
    case "NewComments":
      return "New";
    case "Old":
      return "Old";
    default:
      return "Top";
  }
}
