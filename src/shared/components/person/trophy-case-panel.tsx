import { I18NextService } from "../../services";
import { Component } from "inferno";
import { TrophyCase } from "@cyberbus-net/cyberbus-js-client";

interface TrophyCasePanelProps {
  trophyCase?: TrophyCase;
}

// badge styles map
const badgeStyles: { [key: string]: string } = {
  alpha_user: "badge-gold",
  glorious_group_moderator: "badge-gold",
  closed_beta_user: "badge-silver",
  x7d12_user: "badge-silver",
  open_beta_user: "badge-bronze",
  public_open_beta_user: "badge-bronze",
};

const badgeIcons: { [key: string]: string } = {
  alpha_user:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g id="_15-Medal" data-name="15-Medal"><path d="M41,9V33.76a16.054,16.054,0,0,0-18,0V9Z" style="fill:#edf4fa"/><path d="M54,9V37.93a2.046,2.046,0,0,1-.82,1.66l-6,2.34A16.088,16.088,0,0,0,41,33.76V9Z" style="fill:#9c59a9"/><path d="M23,9V33.76a16.088,16.088,0,0,0-6.18,8.17l-6-2.34A2.046,2.046,0,0,1,10,37.93V9Z" style="fill:#9c59a9"/><path d="M47.18,41.93A15.971,15.971,0,1,1,41,33.76,16.031,16.031,0,0,1,47.18,41.93ZM44,47A12,12,0,1,0,32,59,12,12,0,0,0,44,47Z" style="fill:#ffab02"/><path d="M32,35A12,12,0,1,1,20,47,12,12,0,0,1,32,35Z" style="fill:#ffda4d"/><polygon points="56 1 56 9 54 9 41 9 23 9 10 9 8 9 8 1 56 1" style="fill:#c1cfe8"/><path d="M8,1V9H56V5H16a2,2,0,0,1-2-2V1Z" style="fill:#8394b2"/><path d="M32,33A14,14,0,1,0,46,47,14,14,0,0,0,32,33Zm0,26A12,12,0,1,1,44,47,12,12,0,0,1,32,59Z" style="fill:#ff9102"/><path d="M36,14h5V9H23V33.76A15.984,15.984,0,0,1,32,31V18A4,4,0,0,1,36,14Z" style="fill:#c1cfe8"/><rect x="41" y="9" width="13" height="5" style="fill:#774e9d"/><path d="M10,9V37.93a2.046,2.046,0,0,0,.82,1.66l6,2.34A16.088,16.088,0,0,1,23,33.76V9Z" style="fill:#774e9d"/><path d="M24,43a11.925,11.925,0,0,1,1.762-6.238A11.992,11.992,0,1,0,42.238,53.238,11.983,11.983,0,0,1,24,43Z" style="fill:#ffc400"/><polygon points="28 42 31 40 34 40 34 54 31 54 31 44 28 44 28 42" style="fill:#ff7802"/><path d="M56,0H19V2H55V8H9V2h4V0H8A1,1,0,0,0,7,1V9a1,1,0,0,0,1,1H9V37.93A3.051,3.051,0,0,0,10.228,40.4a.992.992,0,0,0,.226.123l5.161,2.009a17,17,0,1,0,32.77,0l5.161-2.009a.992.992,0,0,0,.226-.123A3.051,3.051,0,0,0,55,37.93V10h1a1,1,0,0,0,1-1V1A1,1,0,0,0,56,0ZM32,62A15,15,0,1,1,47,47,15.017,15.017,0,0,1,32,62ZM53,37.93a1.089,1.089,0,0,1-.324.788l-4.924,1.916A17.071,17.071,0,0,0,42,33.283V14H40V32.008a16.94,16.94,0,0,0-16,0V28H22v5.283a17.071,17.071,0,0,0-5.752,7.351l-4.924-1.916A1.089,1.089,0,0,1,11,37.93V10H22V26h2V10H40v2h2V10H53Z"/><rect x="15" width="2" height="2"/><path d="M42.848,45.165l1.972-.33a12.93,12.93,0,0,0-.56-2.168l-1.886.666A11.008,11.008,0,0,1,42.848,45.165Z"/><path d="M32,34A13,13,0,1,0,45,47H43a10.995,10.995,0,1,1-1.471-5.5l1.731-1A13.048,13.048,0,0,0,32,34Z"/><path d="M31,55h3a1,1,0,0,0,1-1V40a1,1,0,0,0-1-1H31a1.006,1.006,0,0,0-.555.168l-3,2A1,1,0,0,0,27,42v2a1,1,0,0,0,1,1h2v9A1,1,0,0,0,31,55ZM29,43v-.465L31.3,41H33V53H32V44a1,1,0,0,0-1-1Z"/></g></svg>', // Replace with actual SVG content or path
  closed_beta_user:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g id="_16-Medal" data-name="16-Medal"><path d="M41,9V33.76a16.054,16.054,0,0,0-18,0V9Z" style="fill:#edf4fa"/><path d="M54,9V37.93a2.046,2.046,0,0,1-.82,1.66l-6,2.34A16.088,16.088,0,0,0,41,33.76V9Z" style="fill:#9c59a9"/><path d="M23,9V33.76a16.088,16.088,0,0,0-6.18,8.17l-6-2.34A2.046,2.046,0,0,1,10,37.93V9Z" style="fill:#9c59a9"/><path d="M47.18,41.93A15.971,15.971,0,1,1,41,33.76,16.031,16.031,0,0,1,47.18,41.93ZM44,47A12,12,0,1,0,32,59,12,12,0,0,0,44,47Z" style="fill:#a8b7d4"/><path d="M32,35A12,12,0,1,1,20,47,12,12,0,0,1,32,35Z" style="fill:#edf4fa"/><polygon points="56 1 56 9 54 9 41 9 23 9 10 9 8 9 8 1 56 1" style="fill:#c1cfe8"/><path d="M8,1V9H56V5H16a2,2,0,0,1-2-2V1Z" style="fill:#8394b2"/><path d="M32,33A14,14,0,1,0,46,47,14,14,0,0,0,32,33Zm0,26A12,12,0,1,1,44,47,12,12,0,0,1,32,59Z" style="fill:#8394b2"/><path d="M36,14h5V9H23V33.76A15.984,15.984,0,0,1,32,31V18A4,4,0,0,1,36,14Z" style="fill:#c1cfe8"/><rect x="41" y="9" width="13" height="5" style="fill:#774e9d"/><path d="M10,9V37.93a2.046,2.046,0,0,0,.82,1.66l6,2.34A16.088,16.088,0,0,1,23,33.76V9Z" style="fill:#774e9d"/><path d="M24,43a11.925,11.925,0,0,1,1.762-6.238A11.992,11.992,0,1,0,42.238,53.238,11.983,11.983,0,0,1,24,43Z" style="fill:#c1cfe8"/><path d="M32,43a1.959,1.959,0,0,1,2,2c0,2-6,6-6,6v3h9V51H33l2.586-2.586A4.828,4.828,0,0,0,37,45h0s0-5-5-5-5,5-5,5h3A1.959,1.959,0,0,1,32,43Z" style="fill:#5c6979"/><path d="M56,0H19V2H55V8H9V2h4V0H8A1,1,0,0,0,7,1V9a1,1,0,0,0,1,1H9V37.93A3.052,3.052,0,0,0,10.228,40.4a.971.971,0,0,0,.226.123l5.161,2.009a17,17,0,1,0,32.77,0l5.161-2.009a.971.971,0,0,0,.226-.123A3.052,3.052,0,0,0,55,37.93V10h1a1,1,0,0,0,1-1V1A1,1,0,0,0,56,0ZM32,62A15,15,0,1,1,47,47,15.017,15.017,0,0,1,32,62ZM53,37.93a1.089,1.089,0,0,1-.324.788l-4.924,1.917A17.068,17.068,0,0,0,42,33.283V14H40V32.008a16.94,16.94,0,0,0-16,0V28H22v5.283a17.068,17.068,0,0,0-5.752,7.352l-4.924-1.917A1.089,1.089,0,0,1,11,37.93V10H22V26h2V10H40v2h2V10H53Z"/><rect x="15" width="2" height="2"/><path d="M42.848,45.165l1.972-.33a12.831,12.831,0,0,0-.56-2.168l-1.885.666A11.1,11.1,0,0,1,42.848,45.165Z"/><path d="M32,34A13,13,0,1,0,45,47H43a10.995,10.995,0,1,1-1.471-5.5l1.731-1A13.049,13.049,0,0,0,32,34Z"/><path d="M38,45a5.785,5.785,0,0,0-6-6,5.785,5.785,0,0,0-6,6,1,1,0,0,0,1,1h3a1.012,1.012,0,0,0,1-.988A1,1,0,1,1,33,45c0,.766-2.647,3.229-5.555,5.168A1,1,0,0,0,27,51v3a1,1,0,0,0,1,1h9a1,1,0,0,0,1-1V51a1,1,0,0,0-1-1H35.414l.879-.879A5.868,5.868,0,0,0,38,45Zm-3.121,2.707-2.586,2.586A1,1,0,0,0,33,52h3v1H29V51.531c2.105-1.444,6-4.4,6-6.531a2.916,2.916,0,0,0-3-3,2.818,2.818,0,0,0-2.833,2H28.131A3.657,3.657,0,0,1,32,41a3.95,3.95,0,0,1,2.879,6.707Z"/></g></svg>',
  open_beta_user:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g id="_17-Medal" data-name="17-Medal"><path d="M41,9V33.76a16.054,16.054,0,0,0-18,0V9Z" style="fill:#edf4fa"/><path d="M54,9V37.93a2.046,2.046,0,0,1-.82,1.66l-6,2.34A16.088,16.088,0,0,0,41,33.76V9Z" style="fill:#9c59a9"/><path d="M23,9V33.76a16.088,16.088,0,0,0-6.18,8.17l-6-2.34A2.046,2.046,0,0,1,10,37.93V9Z" style="fill:#9c59a9"/><path d="M47.18,41.93A15.971,15.971,0,1,1,41,33.76,16.031,16.031,0,0,1,47.18,41.93ZM44,47A12,12,0,1,0,32,59,12,12,0,0,0,44,47Z" style="fill:#e84840"/><path d="M32,35A12,12,0,1,1,20,47,12,12,0,0,1,32,35Z" style="fill:#ff4f46"/><polygon points="56 1 56 9 54 9 41 9 23 9 10 9 8 9 8 1 56 1" style="fill:#c1cfe8"/><path d="M8,1V9H56V5H16a2,2,0,0,1-2-2V1Z" style="fill:#8394b2"/><path d="M32,33A14,14,0,1,0,46,47,14,14,0,0,0,32,33Zm0,26A12,12,0,1,1,44,47,12,12,0,0,1,32,59Z" style="fill:#ad362f"/><path d="M36,14h5V9H23V33.76A15.984,15.984,0,0,1,32,31V18A4,4,0,0,1,36,14Z" style="fill:#c1cfe8"/><rect x="41" y="9" width="13" height="5" style="fill:#774e9d"/><path d="M10,9V37.93a2.046,2.046,0,0,0,.82,1.66l6,2.34A16.088,16.088,0,0,1,23,33.76V9Z" style="fill:#774e9d"/><path d="M24,43a11.925,11.925,0,0,1,1.762-6.238A11.992,11.992,0,1,0,42.238,53.238,11.983,11.983,0,0,1,24,43Z" style="fill:#db443d"/><path d="M31,47c1.658,0,3,.9,3,2a2,2,0,0,1-4,0H27v1c0,2.211,2.236,4,5,4s5-1.789,5-4a3.674,3.674,0,0,0-1-3,3.674,3.674,0,0,0,1-3c0-2.211-2.236-4-5-4s-5,1.789-5,4v1h3a2,2,0,0,1,4,0C34,46.105,32.658,47,31,47Z" style="fill:#fff"/><path d="M32,39c-3.309,0-6,2.243-6,5v1a1,1,0,0,0,1,1h3a1.012,1.012,0,0,0,1-.988A1,1,0,1,1,33,45c0,.408-.779,1-2,1a1,1,0,0,0,0,2c1.221,0,2,.592,2,.988A1,1,0,1,1,31,49a1,1,0,0,0-1-1H27a1,1,0,0,0-1,1v1c0,2.757,2.691,5,6,5s6-2.243,6-5a4.978,4.978,0,0,0-.709-3A4.978,4.978,0,0,0,38,44C38,41.243,35.309,39,32,39Zm3.293,8.707A2.737,2.737,0,0,1,36,50c0,1.654-1.794,3-4,3s-4-1.346-4-3h1.167A2.818,2.818,0,0,0,32,52a2.916,2.916,0,0,0,3-3,2.617,2.617,0,0,0-.995-2A2.617,2.617,0,0,0,35,45a2.916,2.916,0,0,0-3-3,2.818,2.818,0,0,0-2.833,2H28c0-1.654,1.794-3,4-3s4,1.346,4,3a2.737,2.737,0,0,1-.707,2.293A1,1,0,0,0,35.293,47.707Z"/><path d="M56,0H19V2H55V8H9V2h4V0H8A1,1,0,0,0,7,1V9a1,1,0,0,0,1,1H9V37.93A3.052,3.052,0,0,0,10.228,40.4a.971.971,0,0,0,.226.123l5.161,2.009a17,17,0,1,0,32.77,0l5.161-2.009a.971.971,0,0,0,.226-.123A3.052,3.052,0,0,0,55,37.93V10h1a1,1,0,0,0,1-1V1A1,1,0,0,0,56,0ZM32,62A15,15,0,1,1,47,47,15.017,15.017,0,0,1,32,62ZM53,37.93a1.089,1.089,0,0,1-.324.788l-4.924,1.917A17.068,17.068,0,0,0,42,33.283V14H40V32.008a16.94,16.94,0,0,0-16,0V28H22v5.283a17.068,17.068,0,0,0-5.752,7.352l-4.924-1.917A1.089,1.089,0,0,1,11,37.93V10H22V26h2V10H40v2h2V10H53Z"/><rect x="15" width="2" height="2"/><path d="M42.848,45.165l1.972-.33a12.831,12.831,0,0,0-.56-2.168l-1.885.666A11.1,11.1,0,0,1,42.848,45.165Z"/><path d="M32,34A13,13,0,1,0,45,47H43a10.995,10.995,0,1,1-1.471-5.5l1.731-1A13.049,13.049,0,0,0,32,34Z"/></g></svg>',
};

export class TrophyCasePanel extends Component<TrophyCasePanelProps> {
  constructor(props: TrophyCasePanelProps) {
    super(props);
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN");
  }

  getBadgeClass(name: string): string {
    return badgeStyles[name] || "badge-default";
  }

  getBadgeIcon(name: string): string {
    return badgeIcons[name] || "<svg>...</svg>"; // Default SVG or empty
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
              className={`list-inline-item badge ${this.getBadgeClass(trophy.name)}`}
              title={`${I18NextService.i18n.t("rewarded_at")}: ${this.formatDate(trophy.rewarded_at)}`}
            >
              <span
                className="badge-icon"
                dangerouslySetInnerHTML={{
                  __html: this.getBadgeIcon(trophy.name),
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
