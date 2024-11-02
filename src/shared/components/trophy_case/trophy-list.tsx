import { Component } from "inferno";
import { Trophy } from "@cyberbus-net/cyberbus-js-client";
import { I18NextService } from "../../services";
import { getBadgeClass, getBadgeIcon, formatDate } from "./trophy-utils";

interface TrophyListProps {
  username: string;
  onTrophySelect: (trophy: Trophy) => void;
  trophies?: Trophy[];
}

export class TrophyList extends Component<TrophyListProps> {
  render() {
    const { trophies = [] } = this.props;

    if (!Array.isArray(trophies) || trophies.length === 0) {
      return (
        <div className="list-group-item">
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
        <ul className="list-inline mb-2">
          {trophies.map((trophy, index) => (
            <li key={index} className="list-inline-item">
              <button
                type="button"
                className={`badge border-0 ${getBadgeClass(trophy.name)}`}
                title={`${I18NextService.i18n.t("rewarded_at")}: ${formatDate(trophy.rewarded_at)}`}
                onClick={() => this.props.onTrophySelect(trophy)}
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
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
