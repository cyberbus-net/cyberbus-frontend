import { Component, linkEvent } from "inferno";
import {
  CommunityView,
  FollowCommunity,
} from "@cyberbus-net/cyberbus-js-client";
import { I18NextService } from "../../services";
import { CommunityLink } from "./community-link";
import { SubscribeButton } from "../common/subscribe-button";
import { Badges } from "../common/badges";
import { mdToHtml } from "../../markdown";
import { BannerIconHeader } from "../common/banner-icon-header";
import { HttpService } from "../../services/HttpService";
import { UserService } from "../../services";

interface CommunityCardProps {
  community_view: CommunityView;
  showIcon?: boolean;
  minimal?: boolean;
  followCommunityLoading?: boolean;
  onFollowCommunity?: (form: FollowCommunity) => void;
}

interface CommunityCardState {
  followCommunityLoading: boolean;
}

export class CommunityCard extends Component<
  CommunityCardProps,
  CommunityCardState
> {
  state = {
    followCommunityLoading: false,
  };

  constructor(props: any, context: any) {
    super(props, context);
    this.handleFollowCommunity = this.handleFollowCommunity.bind(this);
    this.handleUnfollowCommunity = this.handleUnfollowCommunity.bind(this);
  }

  render() {
    const { community_view, showIcon = true, minimal = false } = this.props;
    const { community, counts } = community_view;

    return (
      <div className="card h-100">
        {showIcon && (
          <a href={`/c/${community.name}`} className="text-decoration-none">
            <BannerIconHeader banner={community.banner} icon={community.icon} />
          </a>
        )}

        <div className="community-card-body">
          <div className="d-flex align-items-center mb-3">
            <div className="flex-grow-1">
              <h5 className="mb-0">
                <CommunityLink
                  community={community}
                  hideAvatar
                  showTitle={true}
                />
                {community.removed && (
                  <small className="text-muted fst-italic ms-2">
                    {I18NextService.i18n.t("removed")}
                  </small>
                )}
                {community.deleted && (
                  <small className="text-muted fst-italic ms-2">
                    {I18NextService.i18n.t("deleted")}
                  </small>
                )}
                {community.nsfw && (
                  <small className="text-muted fst-italic ms-2">
                    {I18NextService.i18n.t("nsfw")}
                  </small>
                )}
              </h5>
              <CommunityLink
                community={community}
                realLink
                useApubName
                muted
                hideAvatar
              />
            </div>
            <div className="ms-2">
              <SubscribeButton
                communityView={community_view}
                onFollow={linkEvent(this, this.handleFollowCommunity)}
                onUnFollow={linkEvent(this, this.handleUnfollowCommunity)}
                loading={this.state.followCommunityLoading}
              />
            </div>
          </div>

          {!minimal && (
            <>
              <Badges communityId={community.id} counts={counts} />

              {community.description && (
                <div className="mt-3">
                  <div
                    className="md-div text-muted small"
                    dangerouslySetInnerHTML={mdToHtml(community.description)}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  async handleUnfollowCommunity(i: CommunityCard) {
    i.setState({ followCommunityLoading: true });
    await i.handleFollow({
      community_id: i.props.community_view.community.id,
      follow: false,
    });
  }

  async handleFollowCommunity(i: CommunityCard) {
    i.setState({ followCommunityLoading: true });
    await i.handleFollow({
      community_id: i.props.community_view.community.id,
      follow: true,
    });
  }

  async handleFollow(form: FollowCommunity) {
    const followCommunityRes = await HttpService.client.followCommunity(form);

    // Update myUserInfo and component state
    if (followCommunityRes.state === "success") {
      // Update myUserInfo
      const communityId = followCommunityRes.data.community_view.community.id;
      const mui = UserService.Instance.myUserInfo;
      if (mui) {
        mui.follows = mui.follows.filter(i => i.community.id !== communityId);
      }

      // Update community view state
      this.props.community_view.subscribed =
        followCommunityRes.data.community_view.subscribed;
      this.props.community_view.counts =
        followCommunityRes.data.community_view.counts;

      // Force a re-render
      this.forceUpdate();

      // Reset loading state
      this.setState({ followCommunityLoading: false });
    }

    return followCommunityRes;
  }
}
