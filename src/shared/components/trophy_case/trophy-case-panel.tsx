import { I18NextService } from "../../services";
import { Component } from "inferno";
import { TrophyCase } from "@cyberbus-net/cyberbus-js-client";
import { getBadgeClass, getBadgeIcon, formatDate } from "./trophy-utils";

interface TrophyCasePanelProps {
  trophyCase?: TrophyCase;
}

export class TrophyCasePanel extends Component<TrophyCasePanelProps> {
  constructor(props: TrophyCasePanelProps) {
    super(props);
  }

  render() {
    const { trophyCase } = this.props;

    if (
      !trophyCase ||
      !trophyCase.trophies ||
      trophyCase.trophies.length === 0
    ) {
      return (
        <div className="list-group-item">
          <h2 className="h5">{I18NextService.i18n.t("trophy_case")}</h2>
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
        <h2 className="h5">{I18NextService.i18n.t("trophy_case")}</h2>
        <ul className="list-inline mb-2">
          {trophyCase.trophies.map((trophy, index) => (
            <li
              key={index}
              className={`list-inline-item badge ${getBadgeClass(trophy.name)}`}
              title={`${I18NextService.i18n.t("rewarded_at")}: ${formatDate(trophy.rewarded_at)}`}
            >
              <span
                className="badge-icon"
                dangerouslySetInnerHTML={{
                  __html: getBadgeIcon(trophy.name),
                }}
              />
              <span className="badge-text">
                {I18NextService.i18n.t(trophy.name)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
