import { editListImmutable } from "@utils/helpers";
import { PostView } from "@cyberbus-net/cyberbus-js-client";

export default function editPost(
  data: PostView,
  posts: PostView[],
): PostView[] {
  return editListImmutable("post", data, posts);
}
