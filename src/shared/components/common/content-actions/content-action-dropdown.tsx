import { Component } from "inferno";
import { I18NextService, UserService } from "../../../services";
import { Icon } from "../icon";
import { CrossPostParams } from "@utils/types";
import {
  CommunityModeratorView,
  PersonView,
  PostView,
} from "@cyberbus-net/cyberbus-js-client";
import {
  amAdmin,
  amCommunityCreator,
  amMod,
  canAdmin,
  canMod,
} from "@utils/roles";
import ActionButton from "./action-button";
import classNames from "classnames";
import { Link } from "inferno-router";
import ConfirmationModal from "../modal/confirmation-modal";
import ViewVotesModal from "../modal/view-votes-modal";
import ModActionFormModal, {
  BanUpdateForm,
} from "../modal/mod-action-form-modal";
import { BanType, CommentNodeView, PurgeType } from "../../../interfaces";
import { getApubName, hostname } from "@utils/helpers";
import { tippyMixin } from "../../mixins/tippy-mixin";
import html2canvas from "html2canvas";

interface ContentActionDropdownPropsBase {
  onSave: () => Promise<void>;
  onEdit: () => void;
  onDelete: () => Promise<void>;
  onReport: (reason: string) => Promise<void>;
  onBlock: () => Promise<void>;
  onRemove: (reason: string) => Promise<void>;
  onBanFromCommunity: (form: BanUpdateForm) => Promise<void>;
  onAppointCommunityMod: () => Promise<void>;
  onTransferCommunity: () => Promise<void>;
  onBanFromSite: (form: BanUpdateForm) => Promise<void>;
  onPurgeContent: (reason: string) => Promise<void>;
  onPurgeUser: (reason: string) => Promise<void>;
  onAppointAdmin: () => Promise<void>;
  moderators?: CommunityModeratorView[];
  admins?: PersonView[];
}

export type ContentCommentProps = {
  type: "comment";
  commentView: CommentNodeView;
  onReply: () => void;
  onDistinguish: () => Promise<void>;
} & ContentActionDropdownPropsBase;

export type ContentPostProps = {
  type: "post";
  postView: PostView;
  crossPostParams: CrossPostParams;
  onLock: () => Promise<void>;
  onFeatureLocal: () => Promise<void>;
  onFeatureCommunity: () => Promise<void>;
  onHidePost: () => Promise<void>;
  showShareAsImageOptions?: boolean;
} & ContentActionDropdownPropsBase;

type ContentActionDropdownProps = ContentCommentProps | ContentPostProps;

type DialogType =
  | "BanDialog"
  | "RemoveDialog"
  | "PurgeDialog"
  | "ReportDialog"
  | "TransferCommunityDialog"
  | "AppointModDialog"
  | "AppointAdminDialog"
  | "ViewVotesDialog";

type ActionTypeState = {
  banType?: BanType;
  purgeType?: PurgeType;
};

type ShowState = {
  [key in `show${DialogType}`]: boolean;
};

type RenderState = {
  [key in `render${DialogType}`]: boolean;
};

type DropdownState = { dropdownOpenedOnce: boolean };

type ContentActionDropdownState = ActionTypeState &
  ShowState &
  RenderState &
  DropdownState;

@tippyMixin
export default class ContentActionDropdown extends Component<
  ContentActionDropdownProps,
  ContentActionDropdownState
> {
  state: ContentActionDropdownState = {
    showAppointAdminDialog: false,
    showAppointModDialog: false,
    showBanDialog: false,
    showPurgeDialog: false,
    showRemoveDialog: false,
    showReportDialog: false,
    showTransferCommunityDialog: false,
    showViewVotesDialog: false,
    renderAppointAdminDialog: false,
    renderAppointModDialog: false,
    renderBanDialog: false,
    renderPurgeDialog: false,
    renderRemoveDialog: false,
    renderReportDialog: false,
    renderTransferCommunityDialog: false,
    renderViewVotesDialog: false,
    dropdownOpenedOnce: false,
  };

  constructor(props: ContentActionDropdownProps, context: any) {
    super(props, context);

    this.toggleModDialogShow = this.toggleModDialogShow.bind(this);
    this.hideAllDialogs = this.hideAllDialogs.bind(this);
    this.toggleReportDialogShow = this.toggleReportDialogShow.bind(this);
    this.toggleRemoveShow = this.toggleRemoveShow.bind(this);
    this.toggleBanFromCommunityShow =
      this.toggleBanFromCommunityShow.bind(this);
    this.toggleBanFromSiteShow = this.toggleBanFromSiteShow.bind(this);
    this.togglePurgePersonShow = this.togglePurgePersonShow.bind(this);
    this.togglePurgeContentShow = this.togglePurgeContentShow.bind(this);
    this.toggleTransferCommunityShow =
      this.toggleTransferCommunityShow.bind(this);
    this.toggleAppointModShow = this.toggleAppointModShow.bind(this);
    this.toggleAppointAdminShow = this.toggleAppointAdminShow.bind(this);
    this.toggleViewVotesShow = this.toggleViewVotesShow.bind(this);
    this.wrapHandler = this.wrapHandler.bind(this);
    this.handleDropdownToggleClick = this.handleDropdownToggleClick.bind(this);
    this.handleShareAsImage = this.handleShareAsImage.bind(this);
    this.handleShareAsImageWithoutComment =
      this.handleShareAsImageWithoutComment.bind(this);
    this.handleShareAsImageWithComment =
      this.handleShareAsImageWithComment.bind(this);
  }

  render() {
    // Possible enhancement: Priority+ pattern instead of just hard coding which get hidden behind the show more button.
    const { onSave, type, onDelete, onBlock, onEdit, moderators } = this.props;
    const {
      id,
      saved,
      deleted,
      locked,
      removed,
      creator_banned_from_community,
      creator,
      community,
      creator_is_admin,
      creator_is_moderator,
    } = this.contentInfo;
    const dropdownId =
      type === "post"
        ? `post-actions-dropdown-${id}`
        : `comment-actions-dropdown-${id}`;
    const creatorBannedFromLocal = creator.banned;
    const showToggleAdmin = !creatorBannedFromLocal && creator.local;
    const canAppointCommunityMod =
      amAdmin() && community.local && !creator_banned_from_community;

    const modHistoryUserTranslation = I18NextService.i18n.t(
      "user_moderation_history",
      { user: creator.name },
    );

    // The link and translation string for the item
    const { modHistoryItemLink, modHistoryItemTranslation } =
      type === "post"
        ? {
            modHistoryItemLink: `/modlog?postId=${id}`,
            modHistoryItemTranslation: I18NextService.i18n.t(
              "post_moderation_history",
            ),
          }
        : {
            modHistoryItemLink: `/modlog?commentId=${id}`,
            modHistoryItemTranslation: I18NextService.i18n.t(
              "comment_moderation_history",
            ),
          };
    return (
      <>
        {type === "comment" && (
          <ActionButton
            className="comment-button-background big"
            onClick={this.props.onReply}
            icon="message-square"
            inline
            label={I18NextService.i18n.t("reply")}
            noLoading
          />
        )}

        <div className="dropdown">
          <button
            className="btn btn-sm btn-link btn-animate text-muted py-0 dropdown-toggle comment-button-background"
            data-tippy-content={I18NextService.i18n.t("more")}
            data-bs-toggle="dropdown"
            aria-expanded="false"
            aria-controls={dropdownId}
            aria-label={I18NextService.i18n.t("more")}
            onClick={this.handleDropdownToggleClick}
          >
            <Icon icon="more-vertical" inline />
          </button>

          <ul className="dropdown-menu" id={dropdownId}>
            {this.state.dropdownOpenedOnce && (
              <>
                <li>
                  <ActionButton
                    icon="star"
                    label={I18NextService.i18n.t(saved ? "unsave" : "save")}
                    onClick={onSave}
                    iconClass={classNames({ "text-warning": saved })}
                  />
                </li>
                {type === "post" && (
                  <li>
                    <ActionButton
                      icon={this.props.postView.hidden ? "eye" : "eye-slash"}
                      label={I18NextService.i18n.t(
                        this.props.postView.hidden
                          ? "unhide_post"
                          : "hide_post",
                      )}
                      onClick={this.props.onHidePost}
                    />
                  </li>
                )}
                {this.amCreator ? (
                  <>
                    <li>
                      <ActionButton
                        icon="edit"
                        label={I18NextService.i18n.t("edit")}
                        noLoading
                        onClick={onEdit}
                      />
                    </li>
                    <li>
                      <ActionButton
                        onClick={onDelete}
                        icon={deleted ? "undo-trash" : "trash"}
                        label={I18NextService.i18n.t(
                          deleted ? "undelete" : "delete",
                        )}
                        iconClass={`text-${deleted ? "success" : "danger"}`}
                      />
                    </li>
                  </>
                ) : (
                  <>
                    {type === "comment" && (
                      <li>
                        <Link
                          className="btn btn-link btn-sm d-flex align-items-center rounded-0 dropdown-item"
                          to={`/create_private_message/${creator.id}`}
                          title={I18NextService.i18n.t("message")}
                          aria-label={I18NextService.i18n.t("message")}
                          data-tippy-content={I18NextService.i18n.t("message")}
                        >
                          <Icon icon="mail" inline classes="me-2" />
                          {I18NextService.i18n.t("message")}
                        </Link>
                      </li>
                    )}
                    <li>
                      <ActionButton
                        icon="flag"
                        label={I18NextService.i18n.t("create_report")}
                        onClick={this.toggleReportDialogShow}
                        noLoading
                      />
                    </li>
                    <li>
                      <ActionButton
                        icon="slash"
                        label={I18NextService.i18n.t("block_user")}
                        onClick={onBlock}
                      />
                    </li>
                  </>
                )}
                {amAdmin() && (
                  <li>
                    <ActionButton
                      onClick={this.toggleViewVotesShow}
                      label={I18NextService.i18n.t("view_votes")}
                      icon={"arrow-up"}
                      noLoading
                    />
                  </li>
                )}

                {(amMod(community.id) || amAdmin()) && (
                  <>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    {type === "post" && (
                      <>
                        <li>
                          <ActionButton
                            onClick={this.props.onLock}
                            label={I18NextService.i18n.t(
                              locked ? "unlock" : "lock",
                            )}
                            icon={locked ? "unlock" : "lock"}
                          />
                        </li>
                        <li>
                          <ActionButton
                            onClick={this.props.onFeatureCommunity}
                            label={I18NextService.i18n.t(
                              this.props.postView.post.featured_community
                                ? "unfeature_from_community"
                                : "feature_in_community",
                            )}
                            icon={
                              this.props.postView.post.featured_community
                                ? "pin-off"
                                : "pin"
                            }
                          />
                        </li>
                        {amAdmin() && (
                          <li>
                            <ActionButton
                              onClick={this.props.onFeatureLocal}
                              label={I18NextService.i18n.t(
                                this.props.postView.post.featured_local
                                  ? "unfeature_from_local"
                                  : "feature_in_local",
                              )}
                              icon={
                                this.props.postView.post.featured_local
                                  ? "pin-off"
                                  : "pin"
                              }
                            />
                          </li>
                        )}
                      </>
                    )}
                  </>
                )}
                {type === "comment" &&
                  this.amCreator &&
                  (this.canModOnSelf || this.canAdminOnSelf) && (
                    <li>
                      <ActionButton
                        onClick={this.props.onDistinguish}
                        icon={
                          this.props.commentView.comment.distinguished
                            ? "shield-off"
                            : "shield"
                        }
                        label={I18NextService.i18n.t(
                          this.props.commentView.comment.distinguished
                            ? "undistinguish"
                            : "distinguish",
                        )}
                      />
                    </li>
                  )}
                <li>
                  <Link
                    className="btn btn-link btn-sm d-flex align-items-center rounded-0 dropdown-item"
                    to={`/modlog?userId=${creator.id}`}
                    title={modHistoryUserTranslation}
                    aria-label={modHistoryUserTranslation}
                    data-tippy-content={modHistoryUserTranslation}
                  >
                    <Icon icon="history" inline classes="me-2" />
                    {modHistoryUserTranslation}
                  </Link>
                  <Link
                    className="btn btn-link btn-sm d-flex align-items-center rounded-0 dropdown-item"
                    to={modHistoryItemLink}
                    title={modHistoryItemTranslation}
                    aria-label={modHistoryItemTranslation}
                    data-tippy-content={modHistoryItemTranslation}
                  >
                    <Icon icon="history" inline classes="me-2" />
                    {modHistoryItemTranslation}
                  </Link>
                </li>
                {(this.canMod || this.canAdmin) && (
                  <li>
                    <ActionButton
                      label={
                        removed
                          ? `${I18NextService.i18n.t(
                              "restore",
                            )} ${I18NextService.i18n.t(
                              type === "post" ? "post" : "comment",
                            )}`
                          : I18NextService.i18n.t(
                              type === "post"
                                ? "remove_post"
                                : "remove_comment",
                            )
                      }
                      icon={removed ? "restore" : "x"}
                      noLoading
                      onClick={this.toggleRemoveShow}
                      iconClass={`text-${removed ? "success" : "danger"}`}
                    />
                  </li>
                )}
                {this.canMod &&
                  (!creator_is_moderator || canAppointCommunityMod) && (
                    <>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      {!creator_is_moderator && (
                        <li>
                          <ActionButton
                            onClick={this.toggleBanFromCommunityShow}
                            label={I18NextService.i18n.t(
                              creator_banned_from_community
                                ? "unban_from_community"
                                : "ban_from_community",
                            )}
                            icon={
                              creator_banned_from_community ? "unban" : "ban"
                            }
                            noLoading
                            iconClass={`text-${
                              creator_banned_from_community
                                ? "success"
                                : "danger"
                            }`}
                          />
                        </li>
                      )}
                      {canAppointCommunityMod && (
                        <li>
                          <ActionButton
                            onClick={this.toggleAppointModShow}
                            label={I18NextService.i18n.t(
                              `${
                                creator_is_moderator ? "remove" : "appoint"
                              }_as_mod`,
                            )}
                            icon={creator_is_moderator ? "demote" : "promote"}
                            iconClass={`text-${
                              creator_is_moderator ? "danger" : "success"
                            }`}
                            noLoading
                          />
                        </li>
                      )}
                    </>
                  )}
                {(amCommunityCreator(creator.id, moderators) ||
                  this.canAdmin) &&
                  creator_is_moderator && (
                    <li>
                      <ActionButton
                        label={I18NextService.i18n.t("transfer_community")}
                        onClick={this.toggleTransferCommunityShow}
                        icon="transfer"
                        noLoading
                      />
                    </li>
                  )}

                {this.canAdmin && (showToggleAdmin || !creator_is_admin) && (
                  <>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    {!creator_is_admin && (
                      <>
                        <li>
                          <ActionButton
                            label={I18NextService.i18n.t(
                              creatorBannedFromLocal
                                ? "unban_from_site"
                                : "ban_from_site",
                            )}
                            onClick={this.toggleBanFromSiteShow}
                            icon={creatorBannedFromLocal ? "unban" : "ban"}
                            iconClass={`text-${
                              creatorBannedFromLocal ? "success" : "danger"
                            }`}
                            noLoading
                          />
                        </li>
                        <li>
                          <ActionButton
                            label={I18NextService.i18n.t("purge_user")}
                            onClick={this.togglePurgePersonShow}
                            icon="purge"
                            noLoading
                            iconClass="text-danger"
                          />
                        </li>
                        <li>
                          <ActionButton
                            label={I18NextService.i18n.t(
                              `purge_${type === "post" ? "post" : "comment"}`,
                            )}
                            onClick={this.togglePurgeContentShow}
                            icon="purge"
                            noLoading
                            iconClass="text-danger"
                          />
                        </li>
                      </>
                    )}
                    {showToggleAdmin && (
                      <li>
                        <ActionButton
                          label={I18NextService.i18n.t(
                            `${creator_is_admin ? "remove" : "appoint"}_as_admin`,
                          )}
                          onClick={this.toggleAppointAdminShow}
                          icon={creator_is_admin ? "demote" : "promote"}
                          iconClass={`text-${
                            creator_is_admin ? "danger" : "success"
                          }`}
                          noLoading
                        />
                      </li>
                    )}
                  </>
                )}
                {this.props.type === "post" &&
                  this.props.showShareAsImageOptions && (
                    <>
                      <li>
                        <ActionButton
                          label={I18NextService.i18n.t("share_as_image")}
                          onClick={this.handleShareAsImageWithoutComment}
                          icon="image"
                          iconClass={classNames({ "text-warning": saved })}
                          noLoading
                        />
                      </li>
                      <li>
                        <ActionButton
                          label={I18NextService.i18n.t(
                            "share_as_image_with_comment",
                          )}
                          onClick={this.handleShareAsImageWithComment}
                          icon="image"
                          iconClass={classNames({ "text-warning": saved })}
                          noLoading
                        />
                      </li>
                    </>
                  )}
              </>
            )}
          </ul>
        </div>
        {this.moderationDialogs}
      </>
    );
  }

  handleDropdownToggleClick() {
    // This only renders the dropdown. Bootstrap handles the show/hide part.
    this.setState({ dropdownOpenedOnce: true });
  }

  toggleModDialogShow(
    dialogType: DialogType,
    stateOverride: Partial<ActionTypeState> = {},
  ) {
    const showKey: keyof ShowState = `show${dialogType}`;
    const renderKey: keyof RenderState = `render${dialogType}`;
    this.setState<keyof ShowState>({
      showBanDialog: false,
      showRemoveDialog: false,
      showPurgeDialog: false,
      showReportDialog: false,
      showTransferCommunityDialog: false,
      showAppointModDialog: false,
      showAppointAdminDialog: false,
      showViewVotesDialog: false,
      [showKey]: !this.state[showKey],
      [renderKey]: true, // for fade out just keep rendering after show becomes false
      ...stateOverride,
    });
  }

  hideAllDialogs() {
    this.setState<keyof ShowState>({
      showBanDialog: false,
      showPurgeDialog: false,
      showRemoveDialog: false,
      showReportDialog: false,
      showAppointAdminDialog: false,
      showAppointModDialog: false,
      showTransferCommunityDialog: false,
      showViewVotesDialog: false,
    });
  }

  toggleReportDialogShow() {
    this.toggleModDialogShow("ReportDialog");
  }

  toggleRemoveShow() {
    this.toggleModDialogShow("RemoveDialog");
  }

  toggleBanFromCommunityShow() {
    this.toggleModDialogShow("BanDialog", {
      banType: BanType.Community,
    });
  }

  toggleBanFromSiteShow() {
    this.toggleModDialogShow("BanDialog", {
      banType: BanType.Site,
    });
  }

  togglePurgePersonShow() {
    this.toggleModDialogShow("PurgeDialog", {
      purgeType: PurgeType.Person,
    });
  }

  togglePurgeContentShow() {
    this.toggleModDialogShow("PurgeDialog", {
      purgeType:
        this.props.type === "post" ? PurgeType.Post : PurgeType.Comment,
    });
  }

  toggleTransferCommunityShow() {
    this.toggleModDialogShow("TransferCommunityDialog");
  }

  toggleAppointModShow() {
    this.toggleModDialogShow("AppointModDialog");
  }

  toggleAppointAdminShow() {
    this.toggleModDialogShow("AppointAdminDialog");
  }

  toggleViewVotesShow() {
    this.toggleModDialogShow("ViewVotesDialog");
  }

  get moderationDialogs() {
    const {
      showBanDialog,
      showPurgeDialog,
      showRemoveDialog,
      showReportDialog,
      banType,
      purgeType,
      showTransferCommunityDialog,
      showAppointModDialog,
      showAppointAdminDialog,
      showViewVotesDialog,
      renderBanDialog,
      renderPurgeDialog,
      renderRemoveDialog,
      renderReportDialog,
      renderTransferCommunityDialog,
      renderAppointModDialog,
      renderAppointAdminDialog,
      renderViewVotesDialog,
    } = this.state;
    const {
      removed,
      creator,
      creator_banned_from_community,
      community,
      creator_is_admin,
      creator_is_moderator,
      id,
    } = this.contentInfo;
    const {
      onReport,
      onRemove,
      onBanFromCommunity,
      onBanFromSite,
      onPurgeContent,
      onPurgeUser,
      onTransferCommunity,
      onAppointCommunityMod,
      onAppointAdmin,
      type,
    } = this.props;

    return (
      <>
        {renderRemoveDialog && (
          <ModActionFormModal
            onSubmit={this.wrapHandler(onRemove)}
            modActionType={
              type === "comment" ? "remove-comment" : "remove-post"
            }
            isRemoved={removed}
            onCancel={this.hideAllDialogs}
            show={showRemoveDialog}
          />
        )}
        {renderBanDialog && (
          <ModActionFormModal
            onSubmit={this.wrapHandler(
              banType === BanType.Community
                ? onBanFromCommunity
                : onBanFromSite,
            )}
            modActionType={
              banType === BanType.Community ? "community-ban" : "site-ban"
            }
            creator={creator}
            onCancel={this.hideAllDialogs}
            isBanned={
              banType === BanType.Community
                ? creator_banned_from_community
                : banType === BanType.Site
                  ? creator.banned
                  : false
            }
            community={community}
            show={showBanDialog}
          />
        )}
        {renderReportDialog && (
          <ModActionFormModal
            onSubmit={this.wrapHandler(onReport)}
            modActionType={
              type === "comment" ? "report-comment" : "report-post"
            }
            onCancel={this.hideAllDialogs}
            show={showReportDialog}
          />
        )}
        {renderPurgeDialog && (
          <ModActionFormModal
            onSubmit={this.wrapHandler(
              purgeType === PurgeType.Person ? onPurgeUser : onPurgeContent,
            )}
            modActionType={
              purgeType === PurgeType.Post
                ? "purge-post"
                : purgeType === PurgeType.Comment
                  ? "purge-comment"
                  : "purge-person"
            }
            creator={creator}
            onCancel={this.hideAllDialogs}
            show={showPurgeDialog}
          />
        )}
        {renderTransferCommunityDialog && (
          <ConfirmationModal
            show={showTransferCommunityDialog}
            message={I18NextService.i18n.t("transfer_community_are_you_sure", {
              user: getApubName(creator),
              community: getApubName(community),
            })}
            loadingMessage={I18NextService.i18n.t("transferring_community")}
            onNo={this.hideAllDialogs}
            onYes={this.wrapHandler(onTransferCommunity)}
          />
        )}
        {renderAppointModDialog && (
          <ConfirmationModal
            show={showAppointModDialog}
            message={I18NextService.i18n.t(
              creator_is_moderator
                ? "remove_as_mod_are_you_sure"
                : "appoint_as_mod_are_you_sure",
              {
                user: getApubName(creator),
                community: getApubName(community),
              },
            )}
            loadingMessage={I18NextService.i18n.t(
              creator_is_moderator ? "removing_mod" : "appointing_mod",
            )}
            onNo={this.hideAllDialogs}
            onYes={this.wrapHandler(onAppointCommunityMod)}
          />
        )}
        {renderAppointAdminDialog && (
          <ConfirmationModal
            show={showAppointAdminDialog}
            message={I18NextService.i18n.t(
              creator_is_admin
                ? "removing_as_admin_are_you_sure"
                : "appoint_as_admin_are_you_sure",
              {
                user: getApubName(creator),
                instance: hostname(creator.actor_id),
              },
            )}
            loadingMessage={I18NextService.i18n.t(
              creator_is_admin ? "removing_admin" : "appointing_admin",
            )}
            onNo={this.hideAllDialogs}
            onYes={this.wrapHandler(onAppointAdmin)}
          />
        )}
        {renderViewVotesDialog && (
          <ViewVotesModal
            type={type}
            id={id}
            show={showViewVotesDialog}
            onCancel={this.hideAllDialogs}
          />
        )}
      </>
    );
  }

  get contentInfo() {
    if (this.props.type === "post") {
      const {
        post: { id, deleted, locked, removed },
        saved,
        creator,
        creator_banned_from_community,
        community,
        creator_is_admin,
        creator_is_moderator,
      } = this.props.postView;

      return {
        id,
        saved,
        deleted,
        creator,
        locked,
        removed,
        creator_banned_from_community,
        community,
        creator_is_admin,
        creator_is_moderator,
      };
    } else {
      const {
        comment: { id, deleted, removed },
        saved,
        creator,
        creator_banned_from_community,
        community,
        creator_is_admin,
        creator_is_moderator,
      } = this.props.commentView;

      return {
        id,
        saved,
        deleted,
        creator,
        removed,
        creator_banned_from_community,
        community,
        creator_is_admin,
        creator_is_moderator,
      };
    }
  }

  get amCreator() {
    const { creator } = this.contentInfo;

    return (
      creator.id === UserService.Instance.myUserInfo?.local_user_view.person.id
    );
  }

  get canMod() {
    const { creator } = this.contentInfo;
    return canMod(creator.id, this.props.moderators, this.props.admins);
  }

  get canAdmin() {
    const { creator } = this.contentInfo;
    return canAdmin(creator.id, this.props.admins);
  }

  get canModOnSelf() {
    const { creator } = this.contentInfo;
    return canMod(
      creator.id,
      this.props.moderators,
      this.props.admins,
      UserService.Instance.myUserInfo,
      true,
    );
  }

  get canAdminOnSelf() {
    const { creator } = this.contentInfo;
    return canAdmin(
      creator.id,
      this.props.admins,
      UserService.Instance.myUserInfo,
      true,
    );
  }

  wrapHandler(handler: (arg?: any) => Promise<void>) {
    return async (arg?: any) => {
      await handler(arg);
      this.hideAllDialogs();
    };
  }

  async handleShareAsImage(includeComments: boolean = false) {
    if (this.props.type === "post") {
      const selector = includeComments
        ? ".post-and-comments"
        : ".post-listing-full";
      const element = document.querySelector(selector);
      const elementsToHide = document.querySelectorAll(
        ".comment-form, .comments-line, .sort-radios, .comment-bottom-btns",
      );

      // 检查是否为移动设备
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (element) {
        try {
          // 创建临时样式表
          const style = document.createElement("style");
          style.innerHTML = `
            .temp-hide {
              display: none !important;
            }
            ${
              !isMobile
                ? `
            /* 临时调整字体大小的样式（仅桌面端） */
            .post-and-comments, .post-listing-full {
              font-size: 1.5rem !important;
              padding: 0.5rem 1rem !important;
            }
            .post-title h1 {
              font-size: 3rem !important;
              padding: 3rem 0rem !important;
              color: #6F42C1 !important;
            }
            `
                : ""
            }
          `;
          document.head.appendChild(style);

          // 隐藏指定元素
          elementsToHide.forEach(el => el.classList.add("temp-hide"));

          // 等待所有图片加载完成
          await Promise.all(
            Array.from(element.querySelectorAll("img")).map(img => {
              if (img.complete) return Promise.resolve();
              return new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
              });
            }),
          );

          const canvas = await html2canvas(element as HTMLElement, {
            useCORS: true,
            allowTaint: true,
          });
          const dataUrl = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = dataUrl;

          // 过滤文件名
          const filteredName = this.props.postView.post.name
            .replace(/[<>:"/\\|?*\s]/g, "_")
            .split("")
            .filter(char => char.charCodeAt(0) > 31)
            .join("")
            .replace(/_+/g, "_")
            .replace(/^\.+/, "")
            .substring(0, 255);

          link.download = `${filteredName}-shared-post${includeComments ? "-with-comments" : ""}.png`;
          link.click();
        } catch (error) {
          console.error("截图失败:", error);
        } finally {
          // 恢复隐藏的元素显示
          elementsToHide.forEach(el => el.classList.remove("temp-hide"));
          // 移除临时样式表
          const tempStyle = document.head.querySelector("style:last-child");
          if (tempStyle) {
            document.head.removeChild(tempStyle);
          }
        }
      } else {
        console.error("未找到要截图的元素");
      }
    } else {
      console.error("无法将评论分享为图片");
    }
  }

  async handleShareAsImageWithoutComment() {
    this.handleShareAsImage(false);
  }

  async handleShareAsImageWithComment() {
    this.handleShareAsImage(true);
  }
}
