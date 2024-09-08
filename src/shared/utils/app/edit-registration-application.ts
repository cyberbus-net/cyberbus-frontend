import { editListImmutable } from "@utils/helpers";
import { RegistrationApplicationView } from "@cyberbus-net/cyberbus-js-client";

export default function editRegistrationApplication(
  data: RegistrationApplicationView,
  apps: RegistrationApplicationView[],
): RegistrationApplicationView[] {
  return editListImmutable("registration_application", data, apps);
}
