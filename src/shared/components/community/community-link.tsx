import { showAvatars } from "@utils/app";
import { hostname } from "@utils/helpers";
import { Component } from "inferno";
import { Link } from "inferno-router";
import { Community } from "lemmy-js-client";
import { relTags } from "../../config";
import { PictrsImage } from "../common/pictrs-image";

interface CommunityLinkProps {
  community: Community;
  realLink?: boolean;
  useApubName?: boolean;
  muted?: boolean;
  hideAvatar?: boolean;
  showTitle?: boolean;
}

export class CommunityLink extends Component<CommunityLinkProps, any> {
  constructor(props: any, context: any) {
    super(props, context);
  }

  render() {
    const { community, useApubName } = this.props;
    const local = community.local === null ? true : community.local;

    let link: string;
    let serverStr: string | undefined = undefined;

    const title = useApubName
      ? community.name
      : (community.title ?? community.name);

    if (local) {
      link = `/c/${community.name}`;
    } else {
      serverStr = `@${hostname(community.actor_id)}`;
      link = !this.props.realLink
        ? `/c/${community.name}${serverStr}`
        : community.actor_id;
    }
    const classes = `community-link ${this.props.muted ? "text-muted" : ""}`;

    return !this.props.realLink ? (
      <Link title={title} className={classes} to={link}>
        {this.avatarAndName(serverStr, this.props.showTitle)}
      </Link>
    ) : (
      <a title={title} className={classes} href={link} rel={relTags}>
        {this.avatarAndName(serverStr, this.props.showTitle)}
      </a>
    );
  }

  getCommunitySlug() {
    const { community } = this.props;
    const local = community.local === null ? true : community.local;

    let serverStr: string | undefined = undefined;

    let link: string;

    if (local) {
      link = `c/${community.name}`;
    } else {
      serverStr = `@${hostname(community.actor_id)}`;
      link = !this.props.realLink
        ? `c/${community.name}${serverStr}`
        : community.actor_id;
    }
    return link;
  }

  avatarAndName(serverStr?: string, showTitle?: boolean) {
    const icon = this.props.community.icon;
    const nsfw = this.props.community.nsfw;

    if (!showTitle) {
      return (
        <>
          {!this.props.hideAvatar &&
            !this.props.community.removed &&
            showAvatars() &&
            icon && <PictrsImage src={icon} icon nsfw={nsfw} />}
          <span className="h6 overflow-wrap-anywhere">
            {this.getCommunitySlug()}
            {serverStr && <small className="text-muted">{serverStr}</small>}
          </span>
        </>
      );
    } else {
      return (
        <>
          {!this.props.hideAvatar &&
            !this.props.community.removed &&
            showAvatars() &&
            icon && <PictrsImage src={icon} icon nsfw={nsfw} />}
          <span className="h5 overflow-wrap-anywhere">
            {<span>{this.props.community.title}</span>}
          </span>
        </>
      );
    }
  }
}
