import { numToSI } from "@utils/helpers";
import {
  CommunityAggregates,
  CommunityId,
  SiteAggregates,
} from "@cyberbus-net/cyberbus-js-client";
import { I18NextService } from "../../services";

interface BadgesProps {
  counts: CommunityAggregates | SiteAggregates;
  communityId?: CommunityId;
}

const isCommunityAggregates = (
  counts: CommunityAggregates | SiteAggregates,
): counts is CommunityAggregates => {
  return "subscribers" in counts;
};

const isSiteAggregates = (
  counts: CommunityAggregates | SiteAggregates,
): counts is SiteAggregates => {
  return "communities" in counts;
};

export const Badges = ({ counts }: BadgesProps) => {
  return (
    <ul className="badges my-1 list-inline">
      {isSiteAggregates(counts) && (
        <>
          <li className="list-inline-item badge text-bg-secondary">
            {I18NextService.i18n.t("number_of_users", {
              count: Number(counts.users),
              formattedCount: numToSI(counts.users),
            })}
          </li>
          <li className="list-inline-item badge text-bg-secondary">
            {I18NextService.i18n.t("number_of_communities", {
              count: Number(counts.communities),
              formattedCount: numToSI(counts.communities),
            })}
          </li>
        </>
      )}
      {isCommunityAggregates(counts) && (
        <>
          <li className="list-inline-item badge text-bg-secondary">
            {I18NextService.i18n.t("number_of_local_subscribers", {
              count: Number(counts.subscribers_local),
              formattedCount: numToSI(counts.subscribers_local),
            })}
          </li>
        </>
      )}
      <li className="list-inline-item badge text-bg-secondary">
        {I18NextService.i18n.t("number_of_posts", {
          count: Number(counts.posts),
          formattedCount: numToSI(counts.posts),
        })}
      </li>
      <li className="list-inline-item badge text-bg-secondary">
        {I18NextService.i18n.t("number_of_comments", {
          count: Number(counts.comments),
          formattedCount: numToSI(counts.comments),
        })}
      </li>
    </ul>
  );
};
