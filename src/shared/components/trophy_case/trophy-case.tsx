import { Component } from "inferno";
import { HtmlTags } from "../common/html-tags";
import { I18NextService } from "../../services";
import { TrophyDisplay } from "./trophy-display";
import { TrophyList } from "./trophy-list";
import { Trophy } from "@cyberbus-net/cyberbus-js-client";
import {
  RouteData,
  IRoutePropsWithFetch,
  InitialFetchRequest,
  GetSiteResponse,
} from "../common/route-data";
import { HttpService } from "../../services/HttpService";
import { setIsoData } from "@utils/app";
import { getBadgeIcon } from "./trophy-utils";

interface TrophyCasePathProps {
  username: string;
}

interface TrophyCaseProps {
  match: {
    params: TrophyCasePathProps;
  };
}

interface TrophyCaseState {
  selectedTrophy: Trophy | null;
  trophies: Trophy[];
  isIsomorphic: boolean;
  user_display_name: string;
  user_avatar?: string;
}

interface TrophyCaseQueryProps {
  limit?: number;
  page?: number;
}

interface TrophyCaseData extends RouteData {
  trophyCase: {
    trophies: Trophy[];
    person_view?: {
      person: {
        display_name: string;
        avatar?: string;
      };
    };
  } | null;
}

export interface TrophyCaseFetchConfig
  extends IRoutePropsWithFetch<
    TrophyCaseData,
    TrophyCasePathProps,
    TrophyCaseQueryProps
  > {
  path: `/trophy_case/u/:username`;
}

export class TrophyCase extends Component<
  TrophyCaseProps & { data?: TrophyCaseData },
  TrophyCaseState
> {
  private isoData = setIsoData<TrophyCaseData>(this.context);

  constructor(
    props: TrophyCaseProps & { data?: TrophyCaseData },
    context: any,
  ) {
    super(props, context);

    const serverData = this.isoData?.routeData?.trophyCase;
    const serverTrophies = serverData?.trophies || [];

    this.state = {
      selectedTrophy: null,
      trophies: serverTrophies,
      isIsomorphic: true,
      user_display_name: serverData?.person_view?.person?.display_name || "",
      user_avatar: serverData?.person_view?.person?.avatar,
    };

    this.handleTrophySelect = this.handleTrophySelect.bind(this);
  }

  async componentDidMount() {
    if (!this.isoData?.routeData?.trophyCase) {
      await this.fetchUserData();
    }

    const urlParams = new URLSearchParams(window.location.search);
    const trophyName = urlParams.get("trophy");
    if (trophyName && this.state.trophies.length > 0) {
      const trophy = this.state.trophies.find(t => t.name === trophyName);
      if (trophy) {
        this.handleTrophySelect(trophy);
      }
    }
  }

  fetchUserDataToken?: symbol;
  async fetchUserData() {
    const token = (this.fetchUserDataToken = Symbol());

    try {
      const { username } = this.props.match.params;
      const personRes = await HttpService.client.getPersonDetails({
        username: username,
      });

      if (token !== this.fetchUserDataToken) return;

      if (personRes.state === "success") {
        const { person_view, trophy_case } = personRes.data;

        this.setState({
          trophies: trophy_case.trophies,
          user_display_name: person_view.person.display_name,
          user_avatar: person_view.person.avatar,
          isIsomorphic: false,
        });
      }
    } catch (error) {
      console.error("Failed to fetch trophies:", error);
    }
  }

  handleTrophySelect(trophy: Trophy) {
    const trophyWithSvg = {
      ...trophy,
      badgeSvg: getBadgeIcon(trophy.name),
    };
    this.setState({ selectedTrophy: trophyWithSvg });
  }

  static async fetchInitialData(
    req: InitialFetchRequest<TrophyCasePathProps, TrophyCaseQueryProps>,
  ): Promise<TrophyCaseData> {
    if (!req?.match?.params?.username) {
      throw new Error("Username is required but was not provided in params");
    }

    const { username } = req.match.params;
    const personRes = await HttpService.client.getPersonDetails({
      username: username,
    });

    return {
      trophyCase:
        personRes.state === "success"
          ? {
              trophies: personRes.data.trophy_case.trophies,
              person_view: {
                person: {
                  display_name: personRes.data.person_view.person.display_name,
                  avatar: personRes.data.person_view.person.avatar,
                },
              },
            }
          : null,
    };
  }

  static getQueryParams(
    _source: string | undefined,
    _siteRes: GetSiteResponse,
  ): TrophyCaseQueryProps {
    return {};
  }

  render() {
    const { username } = this.props.match.params;
    const { trophies, selectedTrophy, user_display_name, user_avatar } =
      this.state;

    if (trophies.length === 0) {
      return (
        <div className="trophy-case container-lg">
          <div className="row">
            <div className="col-12">
              <h1 className="h4">{I18NextService.i18n.t("trophy_case")}</h1>
              <div className="loading">{I18NextService.i18n.t("loading")}</div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="trophy-case container-lg">
        <HtmlTags
          title={I18NextService.i18n.t("trophy_case")}
          path={this.context.router.route.match.url}
        />
        <div className="row">
          <div className="col-12">
            <div className="user-info d-flex align-items-center">
              <a
                href={`/u/${username}`}
                className="d-flex align-items-center text-decoration-none"
              >
                {user_avatar && (
                  <img
                    src={user_avatar}
                    alt={username}
                    className="user-avatar img-icon circle-icon me-2"
                  />
                )}
                <h1 className="h4 mb-0">{user_display_name}</h1>
                <h1 className="h4 mb-0">
                  - {I18NextService.i18n.t("trophy_case")}
                </h1>
              </a>
            </div>
            <div className="trophy-list-container">
              <TrophyList
                username={username}
                onTrophySelect={this.handleTrophySelect}
                trophies={trophies}
              />
            </div>
            <div className="trophy-display-container mb-4">
              <TrophyDisplay trophy={selectedTrophy} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export function getTrophyCaseQueryParams(
  _source: string | undefined,
  _siteRes: GetSiteResponse,
): TrophyCaseQueryProps {
  return TrophyCase.getQueryParams(_source, _siteRes);
}
