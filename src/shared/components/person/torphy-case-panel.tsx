import { I18NextService } from "../../services";
import { Component } from "inferno";
import { TorphyCase } from "@cyberbus-net/cyberbus-js-client";

interface TorphyCasePanelProps {
  torphyCase?: TorphyCase;
}

export class TorphyCasePanel extends Component<TorphyCasePanelProps> {
  constructor(props: TorphyCasePanelProps) {
    super(props);
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN");
  }

  render() {
    const { torphyCase } = this.props;

    // 如果 torphyCase 为 null 或其中的 trophies 为空，则展示 "you_have_no_trophy"
    if (
      !torphyCase ||
      !torphyCase.trophies ||
      torphyCase.trophies.length === 0
    ) {
      return (
        <div className="list-group-item">
          <h2 className="h5">{I18NextService.i18n.t("torphy_case")}</h2>
          <ul className="list-inline mb-2">
            <li className="list-inline-item badge text-bg-secondary">
              {I18NextService.i18n.t("you_have_no_trophy")}
            </li>
          </ul>
        </div>
      );
    }

    return (
      <div className="list-group-item">
        <h2 className="h5">{I18NextService.i18n.t("torphy_case")}</h2>
        <ul className="list-inline mb-2">
          {torphyCase.trophies.map((trophy, index) => (
            <li
              key={index}
              className="list-inline-item badge text-bg-secondary"
              title={this.formatDate(trophy.rewarded_at)}
            >
              {trophy.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
