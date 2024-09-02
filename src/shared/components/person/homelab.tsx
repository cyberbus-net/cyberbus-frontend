import { I18NextService } from "../../services";
import { Component } from "inferno";

interface HomelabProps {
  placeholder?: string;
}

export class Homelab extends Component<HomelabProps, any> {
  constructor(props: any, context: any) {
    super(props, context);
  }

  render() {
    return (
      <>
        <div className="list-group-item">
          <h2 className="h5">{I18NextService.i18n.t("homelab")}</h2>
          <ul className="list-inline mb-2">
            <li className="list-inline-item badge text-bg-secondary">
              {I18NextService.i18n.t("coming soon")}
            </li>
          </ul>
        </div>
      </>
    );
  }
}
