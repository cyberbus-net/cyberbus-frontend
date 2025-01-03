import { editCommunity, setIsoData, showLocal } from "@utils/app";
import {
  getPageFromString,
  getQueryParams,
  getQueryString,
  resourcesSettled,
} from "@utils/helpers";
import type { QueryParams } from "@utils/types";
import { RouteDataResponse } from "@utils/types";
import { Component, linkEvent } from "inferno";
import {
  CommunityResponse,
  GetSiteResponse,
  CyberbusHttp,
  ListCommunities,
  ListCommunitiesResponse,
  ListingType,
  SortType,
} from "@cyberbus-net/cyberbus-js-client";
import { InitialFetchRequest } from "../../interfaces";
import { FirstLoadService, I18NextService } from "../../services";
import {
  EMPTY_REQUEST,
  HttpService,
  LOADING_REQUEST,
  RequestState,
  wrapClient,
} from "../../services/HttpService";
import { HtmlTags } from "../common/html-tags";
import { Spinner } from "../common/icon";
import { ListingTypeSelect } from "../common/listing-type-select";
import { Paginator } from "../common/paginator";
import { SortSelect } from "../common/sort-select";

import { communityLimit } from "../../config";
import { getHttpBaseInternal } from "../../utils/env";
import { RouteComponentProps } from "inferno-router/dist/Route";
import { IRoutePropsWithFetch } from "../../routes";
import { scrollMixin } from "../mixins/scroll-mixin";
import { isBrowser } from "@utils/browser";
import { CommunityCard } from "./community-card";

type CommunitiesData = RouteDataResponse<{
  listCommunitiesResponse: ListCommunitiesResponse;
}>;

interface CommunitiesState {
  listCommunitiesResponse: RequestState<ListCommunitiesResponse>;
  siteRes: GetSiteResponse;
  searchText: string;
  isIsomorphic: boolean;
}

interface CommunitiesProps {
  listingType: ListingType;
  sort: SortType;
  page: number;
}

function getListingTypeFromQuery(listingType?: string): ListingType {
  return listingType ? (listingType as ListingType) : "Local";
}

function getSortTypeFromQuery(type?: string): SortType {
  return type ? (type as SortType) : "TopMonth";
}

export function getCommunitiesQueryParams(source?: string): CommunitiesProps {
  return getQueryParams<CommunitiesProps>(
    {
      listingType: getListingTypeFromQuery,
      sort: getSortTypeFromQuery,
      page: getPageFromString,
    },
    source,
  );
}

type CommunitiesPathProps = Record<string, never>;
type CommunitiesRouteProps = RouteComponentProps<CommunitiesPathProps> &
  CommunitiesProps;
export type CommunitiesFetchConfig = IRoutePropsWithFetch<
  CommunitiesData,
  CommunitiesPathProps,
  CommunitiesProps
>;

@scrollMixin
export class Communities extends Component<
  CommunitiesRouteProps,
  CommunitiesState
> {
  private isoData = setIsoData<CommunitiesData>(this.context);
  state: CommunitiesState = {
    listCommunitiesResponse: EMPTY_REQUEST,
    siteRes: this.isoData.site_res,
    searchText: "",
    isIsomorphic: false,
  };

  loadingSettled() {
    return resourcesSettled([this.state.listCommunitiesResponse]);
  }

  constructor(props: CommunitiesRouteProps, context: any) {
    super(props, context);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
    this.handleListingTypeChange = this.handleListingTypeChange.bind(this);

    // Only fetch the data if coming from another route
    if (FirstLoadService.isFirstLoad) {
      const { listCommunitiesResponse } = this.isoData.routeData;

      this.state = {
        ...this.state,
        listCommunitiesResponse,
        isIsomorphic: true,
      };
    }
  }

  async componentWillMount() {
    if (!this.state.isIsomorphic && isBrowser()) {
      await this.refetch(this.props);
    }
  }

  componentWillReceiveProps(nextProps: CommunitiesRouteProps) {
    this.refetch(nextProps);
  }

  get documentTitle(): string {
    return `${I18NextService.i18n.t("communities")} - ${
      this.state.siteRes.site_view.site.name
    }`;
  }

  renderListingsCard() {
    switch (this.state.listCommunitiesResponse.state) {
      case "loading":
        return (
          <h5>
            <Spinner large />
          </h5>
        );
      case "success": {
        return (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {this.state.listCommunitiesResponse.data.communities.map(cv => (
              <div className="col mt-2 mb-4" key={cv.community.id}>
                <CommunityCard
                  community_view={cv}
                  onFollow={this.handleFollow}
                />
              </div>
            ))}
          </div>
        );
      }
    }
  }

  render() {
    const { listingType, sort, page } = this.props;
    return (
      <div className="communities container-lg">
        <HtmlTags
          title={this.documentTitle}
          path={this.context.router.route.match.url}
        />
        <div>
          <h1 className="h4 mb-3 ml-3">
            {I18NextService.i18n.t("list_of_communities")}
          </h1>

          {/* selection */}
          <div className="row g-3 align-items-center mb-2 d-none d-md-flex">
            <div className="col-auto">
              <ListingTypeSelect
                type_={listingType}
                showLocal={showLocal(this.isoData)}
                showSubscribed
                onChange={this.handleListingTypeChange}
              />
            </div>
            <div className="col-auto me-auto">
              <SortSelect sort={sort} onChange={this.handleSortChange} />
            </div>
            <div className="col-auto">{this.searchForm()}</div>
          </div>

          <div className="table-responsive">{this.renderListingsCard()}</div>
          <Paginator
            page={page}
            onChange={this.handlePageChange}
            nextDisabled={
              this.state.listCommunitiesResponse.state !== "success" ||
              communityLimit >
                this.state.listCommunitiesResponse.data.communities.length
            }
          />
        </div>
      </div>
    );
  }

  searchForm() {
    return (
      <form className="row" onSubmit={linkEvent(this, this.handleSearchSubmit)}>
        <div className="col-auto">
          <input
            type="text"
            id="communities-search"
            className="form-control"
            value={this.state.searchText}
            placeholder={`${I18NextService.i18n.t("search")}...`}
            onInput={linkEvent(this, this.handleSearchChange)}
            required
            minLength={3}
          />
        </div>
        <div className="col-auto">
          <label className="visually-hidden" htmlFor="communities-search">
            {I18NextService.i18n.t("search")}
          </label>
          <button type="submit" className="btn btn-secondary">
            <span>{I18NextService.i18n.t("search")}</span>
          </button>
        </div>
      </form>
    );
  }

  async updateUrl(props: Partial<CommunitiesProps>) {
    const { listingType, sort, page } = { ...this.props, ...props };

    const queryParams: QueryParams<CommunitiesProps> = {
      listingType: listingType,
      sort: sort,
      page: page?.toString(),
    };

    this.props.history.push(`/communities${getQueryString(queryParams)}`);
  }

  handlePageChange(page: number) {
    this.updateUrl({ page });
  }

  handleSortChange(val: SortType) {
    this.updateUrl({ sort: val, page: 1 });
  }

  handleListingTypeChange(val: ListingType) {
    this.updateUrl({
      listingType: val,
      page: 1,
    });
  }

  handleSearchChange(i: Communities, event: any) {
    i.setState({ searchText: event.target.value });
  }

  handleSearchSubmit(i: Communities, event: any) {
    event.preventDefault();
    const searchParamEncoded = i.state.searchText;
    const { listingType } = i.props;
    i.context.router.history.push(
      `/search${getQueryString({ q: searchParamEncoded, type: "Communities", listingType })}`,
    );
  }

  static async fetchInitialData({
    headers,
    query: { listingType, sort, page },
  }: InitialFetchRequest<
    CommunitiesPathProps,
    CommunitiesProps
  >): Promise<CommunitiesData> {
    const client = wrapClient(
      new CyberbusHttp(getHttpBaseInternal(), { headers }),
    );
    const listCommunitiesForm: ListCommunities = {
      type_: listingType,
      sort,
      limit: communityLimit,
      page,
    };

    return {
      listCommunitiesResponse:
        await client.listCommunities(listCommunitiesForm),
    };
  }

  async handleFollow(data: {
    i: Communities;
    communityId: number;
    follow: boolean;
  }) {
    const res = await HttpService.client.followCommunity({
      community_id: data.communityId,
      follow: data.follow,
    });
    data.i.findAndUpdateCommunity(res);
  }

  fetchToken?: symbol;
  async refetch({ listingType, sort, page }: CommunitiesProps) {
    const token = (this.fetchToken = Symbol());
    this.setState({ listCommunitiesResponse: LOADING_REQUEST });
    const listCommunitiesResponse = await HttpService.client.listCommunities({
      type_: listingType,
      sort: sort,
      limit: communityLimit,
      page,
    });
    if (token === this.fetchToken) {
      this.setState({ listCommunitiesResponse });
    }
  }

  findAndUpdateCommunity(res: RequestState<CommunityResponse>) {
    this.setState(s => {
      if (
        s.listCommunitiesResponse.state === "success" &&
        res.state === "success"
      ) {
        s.listCommunitiesResponse.data.communities = editCommunity(
          res.data.community_view,
          s.listCommunitiesResponse.data.communities,
        );
      }
      return s;
    });
  }
}
