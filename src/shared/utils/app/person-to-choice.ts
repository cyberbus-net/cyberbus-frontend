import { personSelectName } from "@utils/app";
import { Choice } from "@utils/types";
import { PersonView } from "@cyberbus-net/cyberbus-js-client";

export default function personToChoice(pvs: PersonView): Choice {
  return {
    value: pvs.person.id.toString(),
    label: personSelectName(pvs),
  };
}
