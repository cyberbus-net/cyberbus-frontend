import { myAuth, setIsoData } from "@utils/app";
import { canShare, share } from "@utils/browser";
import { getExternalHost, getHttpBase } from "@utils/env";
import { futureDaysToUnixTime, hostname } from "@utils/helpers";
import { isImage, isVideo } from "@utils/media";
import { canAdmin, canMod } from "@utils/roles";
import classNames from "classnames";
import { Component, linkEvent } from "inferno";
import { Link } from "inferno-router";
import { T } from "inferno-i18next-dess";
import {
  AddAdmin,
  AddModToCommunity,
  BanFromCommunity,
  BanPerson,
  BlockPerson,
  CommunityModeratorView,
  CreatePostLike,
  CreatePostReport,
  DeletePost,
  EditPost,
  FeaturePost,
  HidePost,
  Language,
  LocalUserVoteDisplayMode,
  LockPost,
  MarkPostAsRead,
  PersonView,
  PostResponse,
  PostView,
  PurgePerson,
  PurgePost,
  RemovePost,
  SavePost,
  TransferCommunity,
} from "@cyberbus-net/cyberbus-js-client";
import { relTags, torrentHelpUrl } from "../../config";
import { IsoDataOptionalSite, VoteContentType } from "../../interfaces";
import { mdToHtml, mdToHtmlInline } from "../../markdown";
import { I18NextService, UserService } from "../../services";
import { tippyMixin } from "../mixins/tippy-mixin";
import { Icon } from "../common/icon";
import { BigIcon } from "../common/big-icon";
import { MomentTime } from "../common/moment-time";
import { PictrsImage } from "../common/pictrs-image";
import { UserBadges } from "../common/user-badges";
import { VoteButtons, VoteButtonsCompact } from "../common/vote-buttons";
import { CommunityLink } from "../community/community-link";
import { PersonListing } from "../person/person-listing";
import { MetadataCard } from "./metadata-card";
import { PostForm } from "./post-form";
import { BanUpdateForm } from "../common/modal/mod-action-form-modal";
import PostActionDropdown from "../common/content-actions/post-action-dropdown";
import { CrossPostParams } from "@utils/types";
import { RequestState } from "../../services/HttpService";
import { toast } from "../../toast";
import isMagnetLink, {
  extractMagnetLinkDownloadName,
} from "@utils/media/is-magnet-link";
import QRCode from "qrcode";

const postTruncateAtLines = 8;
const postTruncateAtLinks = 1;

type PostListingState = {
  showEdit: boolean;
  imageExpanded: boolean;
  viewSource: boolean;
  showAdvanced: boolean;
  showBody: boolean;
  loading: boolean;
  showQRCode: boolean;
  postUrl: string;
  qrCodeDataUrl: string;
};

interface PostListingProps {
  post_view: PostView;
  crossPosts?: PostView[];
  moderators?: CommunityModeratorView[];
  admins?: PersonView[];
  allLanguages: Language[];
  siteLanguages: number[];
  showCommunity?: boolean;
  /**
   * Controls whether to show both the body *and* the metadata preview card
   */
  showBody?: boolean;
  hideImage?: boolean;
  enableDownvotes?: boolean;
  voteDisplayMode: LocalUserVoteDisplayMode;
  enableNsfw?: boolean;
  viewOnly?: boolean;
  showFull?: boolean;
  onPostEdit(form: EditPost): Promise<RequestState<PostResponse>>;
  onPostVote(form: CreatePostLike): Promise<RequestState<PostResponse>>;
  onPostReport(form: CreatePostReport): Promise<void>;
  onBlockPerson(form: BlockPerson): Promise<void>;
  onLockPost(form: LockPost): Promise<void>;
  onDeletePost(form: DeletePost): Promise<void>;
  onRemovePost(form: RemovePost): Promise<void>;
  onSavePost(form: SavePost): Promise<void>;
  onFeaturePost(form: FeaturePost): Promise<void>;
  onPurgePerson(form: PurgePerson): Promise<void>;
  onPurgePost(form: PurgePost): Promise<void>;
  onBanPersonFromCommunity(form: BanFromCommunity): Promise<void>;
  onBanPerson(form: BanPerson): Promise<void>;
  onAddModToCommunity(form: AddModToCommunity): Promise<void>;
  onAddAdmin(form: AddAdmin): Promise<void>;
  onTransferCommunity(form: TransferCommunity): Promise<void>;
  onMarkPostAsRead(form: MarkPostAsRead): void;
  onHidePost(form: HidePost): Promise<void>;
  onScrollIntoCommentsClick?(e: MouseEvent): void;
}

@tippyMixin
export class PostListing extends Component<PostListingProps, PostListingState> {
  private readonly isoData: IsoDataOptionalSite = setIsoData(this.context);
  state: PostListingState = {
    showEdit: false,
    imageExpanded: true,
    viewSource: false,
    showAdvanced: false,
    showBody: true,
    loading: false,
    showQRCode: false,
    postUrl: "",
    qrCodeDataUrl: "",
  };

  constructor(props: any, context: any) {
    super(props, context);

    this.handleEditPost = this.handleEditPost.bind(this);
    this.handleEditCancel = this.handleEditCancel.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleReport = this.handleReport.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleSavePost = this.handleSavePost.bind(this);
    this.handleBlockPerson = this.handleBlockPerson.bind(this);
    this.handleDeletePost = this.handleDeletePost.bind(this);
    this.handleModLock = this.handleModLock.bind(this);
    this.handleModFeaturePostCommunity =
      this.handleModFeaturePostCommunity.bind(this);
    this.handleModFeaturePostLocal = this.handleModFeaturePostLocal.bind(this);
    this.handleAppointCommunityMod = this.handleAppointCommunityMod.bind(this);
    this.handleAppointAdmin = this.handleAppointAdmin.bind(this);
    this.handleTransferCommunity = this.handleTransferCommunity.bind(this);
    this.handleModBanFromCommunity = this.handleModBanFromCommunity.bind(this);
    this.handleModBanFromSite = this.handleModBanFromSite.bind(this);
    this.handlePurgePerson = this.handlePurgePerson.bind(this);
    this.handlePurgePost = this.handlePurgePost.bind(this);
    this.handleHidePost = this.handleHidePost.bind(this);
  }

  unlisten = () => {};

  componentWillMount(): void {
    if (
      UserService.Instance.myUserInfo &&
      !this.isoData.showAdultConsentModal
    ) {
      const { auto_expand, blur_nsfw } =
        UserService.Instance.myUserInfo.local_user_view.local_user;
      this.setState({
        imageExpanded: auto_expand && !(blur_nsfw && this.postView.post.nsfw),
      });
    }

    // Leave edit mode on navigation
    this.unlisten = this.context.router.history.listen(() => {
      if (this.state.showEdit) {
        this.setState({ showEdit: false });
      }
    });
  }

  componentWillUnmount(): void {
    this.unlisten();
  }

  get postView(): PostView {
    return this.props.post_view;
  }

  componentDidMount() {
    this.generateQRCode();
  }

  generateQRCode() {
    const { post } = this.postView;
    const postUrl = `https://cyberbus.net/post/${post.id}`;
    this.setState({ postUrl: postUrl });
    QRCode.toDataURL(
      postUrl,
      { width: 128, margin: 2, color: { dark: "#6f42c1", light: "#ffffff" } },
      (err, url) => {
        if (err) {
          console.error("Error generating QR code:", err);
        } else {
          this.setState({ qrCodeDataUrl: url });
        }
      },
    );
  }

  render() {
    const post = this.postView.post;

    // render full post content
    if (this.props.showFull) {
      return (
        <div className="post-listing-full mt-1">
          {!this.state.showEdit ? (
            <>
              {this.postTitleFull()}
              {!this.props.hideImage && this.img}
              {this.showBody && post.url && post.embed_title && (
                <MetadataCard post={post} />
              )}
              {this.showBody && this.body()}
            </>
          ) : (
            <PostForm
              post_view={this.postView}
              crossPosts={this.props.crossPosts}
              onEdit={this.handleEditPost}
              onCancel={this.handleEditCancel}
              enableNsfw={this.props.enableNsfw}
              enableDownvotes={this.props.enableDownvotes}
              voteDisplayMode={this.props.voteDisplayMode}
              allLanguages={this.props.allLanguages}
              siteLanguages={this.props.siteLanguages}
              loading={this.state.loading}
            />
          )}
          {this.commentsLine()}
          {this.duplicatesLine()}
          {this.qrCodeLine()}
        </div>
      );
    }

    // render post-listing's post
    return (
      <div className="post-listing mt-1">
        {!this.state.showEdit ? (
          <>
            {this.postTitle()}
            <a
              href={`/post/${post.id}`}
              className="text-neutral-content visited:text-neutral-content-weak"
            >
              {!this.props.hideImage && this.img}
              {this.showBody && post.url && post.embed_title && (
                <MetadataCard post={post} />
              )}
              {this.showBody && this.body()}
            </a>
          </>
        ) : (
          <a
            href={`/post/${post.id}`}
            className="text-neutral-content visited:text-neutral-content-weak"
          >
            <PostForm
              post_view={this.postView}
              crossPosts={this.props.crossPosts}
              onEdit={this.handleEditPost}
              onCancel={this.handleEditCancel}
              enableNsfw={this.props.enableNsfw}
              enableDownvotes={this.props.enableDownvotes}
              voteDisplayMode={this.props.voteDisplayMode}
              allLanguages={this.props.allLanguages}
              siteLanguages={this.props.siteLanguages}
              loading={this.state.loading}
            />
          </a>
        )}
        {this.commentsLine()}
        {this.duplicatesLine()}
      </div>
    );
  }

  replaceTrailingNewline(input: string): string {
    const newlineRegex = /(\r\n|\n|\r)$/;
    return input.replace(newlineRegex, "...");
  }

  truncateAtNLine(
    body: string | undefined,
    nline: number,
    nlink: number,
  ): string {
    // Handle undefined or null body
    if (body === undefined || body === null) {
      return "";
    }

    const markdownCodeBlockStart = "```";
    const markdownCodeBlockEnd = "```";

    let lineCount = 0;
    let linkCount = 0;
    let inCodeBlock = false;
    let inBlockquote = false;
    let inList = false;
    let inTable = false;
    let result = "";
    let i = 0;

    while (i < body.length) {
      const remainingText = body.substring(i);

      // 简单检查当前行是否包含http链接
      const nextLineBreak = remainingText.search(/(?:\r\n|\r|\n)/);
      const currentLine =
        nextLineBreak === -1
          ? remainingText
          : remainingText.substring(0, nextLineBreak);

      if (currentLine.includes("http")) {
        linkCount++;
        // 如果链接数量超过限制，在当前行结束时截断
        if (linkCount >= nlink) {
          result += currentLine + "\n";
          return this.replaceTrailingNewline(result);
        }
      }

      // Find indices for line breaks, code block start, code block end, blockquote start, list start, and table start
      const nextLineBreakIndex = remainingText.search(/(?:\r\n|\r|\n)/);
      const nextCodeBlockStartIndex = remainingText.indexOf(
        markdownCodeBlockStart,
      );
      const nextCodeBlockEndIndex = remainingText.indexOf(markdownCodeBlockEnd);
      const nextBlockquoteStartIndex = remainingText.indexOf(">");
      const nextListStartIndex = remainingText.search(
        /^(?:\s*[\*\-\+]\s|\s*\d+\.\s)/m,
      );
      const nextTableStartIndex = remainingText.indexOf("|");

      if (
        nextLineBreakIndex === -1 &&
        nextCodeBlockStartIndex === -1 &&
        nextCodeBlockEndIndex === -1 &&
        nextBlockquoteStartIndex === -1 &&
        nextListStartIndex === -1 &&
        nextTableStartIndex === -1
      ) {
        result += remainingText;
        break;
      }

      if (inCodeBlock) {
        // Handle text within code block
        if (nextCodeBlockEndIndex !== -1) {
          result += remainingText.substring(
            0,
            nextCodeBlockEndIndex + markdownCodeBlockEnd.length,
          );
          i += nextCodeBlockEndIndex + markdownCodeBlockEnd.length;
          inCodeBlock = false;
        } else {
          result += remainingText;
          break;
        }
      } else if (inBlockquote || inList || inTable) {
        // Handle text within blockquote, list, or table
        const nextSyntaxEnd = Math.min(
          nextLineBreakIndex === -1 ? Infinity : nextLineBreakIndex,
          nextBlockquoteStartIndex === -1 ? Infinity : nextBlockquoteStartIndex,
          nextListStartIndex === -1 ? Infinity : nextListStartIndex,
          nextTableStartIndex === -1 ? Infinity : nextTableStartIndex,
        );
        if (nextSyntaxEnd === Infinity) {
          result += remainingText;
          break;
        }
        result += remainingText.substring(0, nextSyntaxEnd);
        i += nextSyntaxEnd;
        if (nextLineBreakIndex === nextSyntaxEnd) {
          lineCount++;
          if (lineCount === nline) {
            break;
          }
        }
      } else {
        // Handle text outside of code block
        if (
          nextCodeBlockStartIndex !== -1 &&
          (nextLineBreakIndex === -1 ||
            nextCodeBlockStartIndex < nextLineBreakIndex)
        ) {
          // Found the start of a code block
          result += remainingText.substring(
            0,
            nextCodeBlockStartIndex + markdownCodeBlockStart.length,
          );
          i += nextCodeBlockStartIndex + markdownCodeBlockStart.length;
          inCodeBlock = true;
        } else if (nextLineBreakIndex !== -1) {
          // Found a line break
          lineCount++;
          if (lineCount === nline) {
            result += remainingText.substring(0, nextLineBreakIndex + 1);
            break;
          }
          result += remainingText.substring(0, nextLineBreakIndex + 1);
          i += nextLineBreakIndex + 1;
        } else if (
          nextBlockquoteStartIndex !== -1 &&
          (nextLineBreakIndex === -1 ||
            nextBlockquoteStartIndex < nextLineBreakIndex)
        ) {
          // Found the start of a blockquote
          result += remainingText.substring(0, nextBlockquoteStartIndex + 1); // include the '>' character
          i += nextBlockquoteStartIndex + 1;
          inBlockquote = true;
        } else if (
          nextListStartIndex !== -1 &&
          (nextLineBreakIndex === -1 || nextListStartIndex < nextLineBreakIndex)
        ) {
          // Found the start of a list
          result += remainingText.substring(
            0,
            nextListStartIndex +
              remainingText.substring(nextListStartIndex).search(/\n/) +
              1,
          );
          i +=
            nextListStartIndex +
            remainingText.substring(nextListStartIndex).search(/\n/) +
            1;
          inList = true;
        } else if (
          nextTableStartIndex !== -1 &&
          (nextLineBreakIndex === -1 ||
            nextTableStartIndex < nextLineBreakIndex)
        ) {
          // Found the start of a table
          result += remainingText.substring(
            0,
            remainingText.indexOf("\n", nextTableStartIndex) + 1,
          );
          i += remainingText.indexOf("\n", nextTableStartIndex) + 1;
          inTable = true;
        }
      }

      // 在每次循环结束时检查是否需要因为链接数量而截断
      if (linkCount > nlink) {
        return this.replaceTrailingNewline(result);
      }
    }

    // 如果少于nline行，返回整个内容
    if (lineCount >= nline) {
      return this.replaceTrailingNewline(result);
    }
    return result;
  }

  body() {
    var body;
    if (this.props.showFull) {
      body = this.postView.post.body;
    } else {
      body = this.truncateAtNLine(
        this.postView.post.body,
        postTruncateAtLines,
        postTruncateAtLinks,
      );
    }
    return body ? (
      <article className="my-2">
        {this.state.viewSource ? (
          <pre>{body}</pre>
        ) : (
          <div
            className="md-div"
            dangerouslySetInnerHTML={mdToHtml(body, () => this.forceUpdate())}
            ref={el => {
              if (el && !this.props.showFull) {
                // 处理所有图片容器
                const containers = el.getElementsByClassName("img-container");
                Array.from(containers).forEach(container => {
                  const img = container.querySelector("img");
                  if (img) {
                    img.onload = () => this.handleImageLoad(img, container);
                  }
                });
              }
            }}
          />
        )}
      </article>
    ) : (
      <></>
    );
  }

  torrentHelp() {
    return (
      <div className="alert alert-info small my-2" role="alert">
        <Icon icon="info" classes="icon-inline me-2" />
        <T parent="span" i18nKey="torrent_help">
          #
          <a className="alert-link" rel={relTags} href={torrentHelpUrl}>
            #
          </a>
        </T>
      </div>
    );
  }

  get videoBlock() {
    const post = this.postView.post;
    const url = post.url;

    // if direct video link or embedded video link
    if (url && isVideo(url)) {
      return (
        <div className="ratio ratio-16x9 mt-3">
          <video
            onLoadStart={linkEvent(this, this.handleVideoLoadStart)}
            onPlay={linkEvent(this, this.handleVideoLoadStart)}
            onVolumeChange={linkEvent(this, this.handleVideoVolumeChange)}
            controls
          >
            <source src={post.embed_video_url ?? url} type="video/mp4" />
          </video>
        </div>
      );
    } else if (post.embed_video_url) {
      return (
        <div className="ratio ratio-16x9 mt-3">
          <iframe
            title="video embed"
            src={post.embed_video_url}
            sandbox="allow-same-origin allow-scripts"
            allowFullScreen={true}
          ></iframe>
        </div>
      );
    }
  }

  get img() {
    const { post } = this.postView;

    if (this.isoData.showAdultConsentModal) {
      return <></>;
    }

    if (this.imageSrc) {
      return (
        <>
          <div className="my-2 d-none d-sm-block">
            <PictrsImage src={this.imageSrc} alt={post.alt_text} />
          </div>
        </>
      );
    }

    return <></>;
  }

  imgThumb(src: string) {
    const pv = this.postView;
    return (
      <PictrsImage
        src={src}
        thumbnail
        alt={pv.post.alt_text}
        nsfw={pv.post.nsfw || pv.community.nsfw}
      />
    );
  }

  get imageSrc(): string | undefined {
    const post = this.postView.post;
    const url = post.url;

    if (url && isImage(url)) {
      return url;
    } else {
      return undefined;
    }
  }

  thumbnail() {
    const post = this.postView.post;
    const url = post.url;
    const thumbnail = post.thumbnail_url;

    if (!this.props.hideImage && url && isImage(url) && this.imageSrc) {
      return (
        <button
          type="button"
          className="thumbnail rounded overflow-hidden d-inline-block position-relative p-0 border-0 bg-transparent"
          data-tippy-content={I18NextService.i18n.t("expand_here")}
          onClick={linkEvent(this, this.handleImageExpandClick)}
          aria-label={I18NextService.i18n.t("expand_here")}
        >
          {this.imgThumb(this.imageSrc)}
          <Icon
            icon="image"
            classes="d-block text-white position-absolute end-0 top-0 mini-overlay text-opacity-75 text-opacity-100-hover"
          />
        </button>
      );
    } else if (
      !this.props.hideImage &&
      url &&
      thumbnail &&
      this.imageSrc &&
      !isVideo(url)
    ) {
      return (
        <a
          className="thumbnail rounded overflow-hidden d-inline-block position-relative p-0 border-0"
          href={url}
          rel={relTags}
          title={url}
          target={this.linkTarget}
        >
          {this.imgThumb(this.imageSrc)}
          <Icon
            icon="external-link"
            classes="d-block text-white position-absolute end-0 top-0 mini-overlay text-opacity-75 text-opacity-100-hover"
          />
        </a>
      );
    } else if (url) {
      if ((!this.props.hideImage && isVideo(url)) || post.embed_video_url) {
        return (
          <a
            className={classNames(
              "thumbnail rounded",
              thumbnail
                ? "overflow-hidden d-inline-block position-relative p-0 border-0"
                : "text-body bg-light d-flex justify-content-center",
            )}
            href={url}
            title={url}
            rel={relTags}
            data-tippy-content={I18NextService.i18n.t("expand_here")}
            onClick={linkEvent(this, this.handleImageExpandClick)}
            aria-label={I18NextService.i18n.t("expand_here")}
            target={this.linkTarget}
          >
            {thumbnail && this.imgThumb(thumbnail)}
            <Icon
              icon="video"
              classes={
                thumbnail
                  ? "d-block text-white position-absolute end-0 top-0 mini-overlay text-opacity-75 text-opacity-100-hover"
                  : "d-flex align-items-center"
              }
            />
          </a>
        );
      } else {
        return (
          <a
            className="text-body"
            href={url}
            title={url}
            rel={relTags}
            target={this.linkTarget}
          >
            <div className="thumbnail rounded bg-light d-flex justify-content-center">
              <Icon icon="external-link" classes="d-flex align-items-center" />
            </div>
          </a>
        );
      }
    } else {
      return (
        <Link
          className="text-body"
          to={`/post/${post.id}`}
          title={I18NextService.i18n.t("comments")}
        >
          <div className="thumbnail rounded bg-light d-flex justify-content-center">
            <Icon icon="message-square" classes="d-flex align-items-center" />
          </div>
        </Link>
      );
    }
  }

  createdLine() {
    const pv = this.postView;

    return (
      <div className="mb-md-0 line-h-2rem">
        <PersonListing person={pv.creator} />
        <UserBadges
          classNames="ms-1"
          isMod={pv.creator_is_moderator}
          isAdmin={pv.creator_is_admin}
          isBot={pv.creator.bot_account}
        />
        {this.props.showCommunity && (
          <>
            {" "}
            {I18NextService.i18n.t("@")}{" "}
            <CommunityLink community={pv.community} />
          </>
        )}{" "}
        <span className="h6"> · </span>
        <MomentTime published={pv.post.published} updated={pv.post.updated} />
      </div>
    );
  }

  createdLineForPostListing() {
    const pv = this.postView;

    return (
      <div className="mb-md-0 line-h-2rem">
        {this.props.showCommunity && (
          <>
            <CommunityLink community={pv.community} />
          </>
        )}
        {!this.props.showCommunity && (
          <>
            <PersonListing person={pv.creator} />
            <UserBadges
              classNames="ms-1"
              isMod={pv.creator_is_moderator}
              isAdmin={pv.creator_is_admin}
              isBot={pv.creator.bot_account}
            />
          </>
        )}
        <span className="h6"> · </span>
        <MomentTime published={pv.post.published} updated={pv.post.updated} />
      </div>
    );
  }

  get postLink() {
    const post = this.postView.post;
    return (
      <Link
        className={`d-inline ${
          !post.featured_community && !post.featured_local
            ? "link-dark"
            : "link-primary"
        }`}
        to={`/post/${post.id}`}
        title={I18NextService.i18n.t("comments")}
      >
        <span
          className="d-inline"
          dangerouslySetInnerHTML={mdToHtmlInline(post.name)}
        />
      </Link>
    );
  }

  postTitleLine() {
    const post = this.postView.post;
    const url = post.url;

    return (
      <>
        <div className="post-title">
          <h1 className="h5 mb-2 d-inline text-break">{post.name}</h1>

          {post.removed && (
            <small className="ms-2 badge text-bg-secondary">
              {I18NextService.i18n.t("removed")}
            </small>
          )}

          {post.deleted && (
            <small
              className="unselectable pointer ms-2 text-muted fst-italic"
              data-tippy-content={I18NextService.i18n.t("deleted")}
            >
              <Icon icon="trash" classes="icon-inline text-danger" />
            </small>
          )}

          {post.locked && (
            <small
              className="unselectable pointer ms-2 text-muted fst-italic"
              data-tippy-content={I18NextService.i18n.t("locked")}
            >
              <Icon icon="lock" classes="icon-inline text-danger" />
            </small>
          )}

          {post.featured_community && (
            <small
              className="unselectable pointer ms-2 text-muted fst-italic"
              data-tippy-content={I18NextService.i18n.t(
                "featured_in_community",
              )}
              aria-label={I18NextService.i18n.t("featured_in_community")}
            >
              <Icon icon="pin" classes="icon-inline text-primary" />
            </small>
          )}

          {post.featured_local && (
            <small
              className="unselectable pointer ms-2 text-muted fst-italic"
              data-tippy-content={I18NextService.i18n.t("featured_in_local")}
              aria-label={I18NextService.i18n.t("featured_in_local")}
            >
              <Icon icon="pin" classes="icon-inline text-secondary" />
            </small>
          )}

          {post.nsfw && (
            <small className="ms-2 badge text-bg-danger">
              {I18NextService.i18n.t("nsfw")}
            </small>
          )}
        </div>
        {url && this.urlLine()}
      </>
    );
  }

  urlLine() {
    const post = this.postView.post;
    const url = post.url;

    if (url) {
      // If its a torrent link, extract the download name
      const linkName = isMagnetLink(url)
        ? extractMagnetLinkDownloadName(url)
        : !(hostname(url) === getExternalHost())
          ? hostname(url)
          : null;

      if (linkName) {
        return (
          <p className="small m-0">
            {url && !(hostname(url) === getExternalHost()) && (
              <a
                className="fst-italic link-warp link-dark link-opacity-75 link-opacity-100-hover"
                href={url}
                title={url}
                rel={relTags}
              >
                {url}
              </a>
            )}
          </p>
        );
      }
    }
  }

  duplicatesLine() {
    const dupes = this.props.crossPosts;
    return dupes && dupes.length > 0 ? (
      <ul className="list-inline mb-1 small text-muted">
        <>
          <li className="list-inline-item me-2">
            {I18NextService.i18n.t("cross_posted_to")}
          </li>
          {dupes.map(pv => (
            <li key={pv.post.id} className="list-inline-item me-2">
              <Link to={`/post/${pv.post.id}`}>
                {pv.community.local
                  ? pv.community.name
                  : `${pv.community.name}@${hostname(pv.community.actor_id)}`}
              </Link>
            </li>
          ))}
        </>
      </ul>
    ) : (
      <></>
    );
  }

  commentsLine(mobile = false) {
    const { onPostVote, enableDownvotes, voteDisplayMode } = this.props;
    const {
      post: { id },
      my_vote,
      counts,
    } = this.postView;

    return (
      <>
        <div className="comments-line d-flex align-items-center justify-content-start flex-wrap mt-2">
          {this.isInteractable && (
            <VoteButtons
              voteContentType={VoteContentType.Post}
              id={this.postView.post.id}
              onVote={this.props.onPostVote}
              enableDownvotes={this.props.enableDownvotes}
              voteDisplayMode={this.props.voteDisplayMode}
              counts={this.postView.counts}
              myVote={this.postView.my_vote}
            />
          )}
          {this.commentsButton}
          {canShare() && (
            <button
              className="btn btn-lg btn-link btn-animate text-muted py-0"
              onClick={linkEvent(this, this.handleShare)}
              type="button"
            >
              <Icon icon="share" inline />
            </button>
          )}
          {mobile && this.isInteractable && (
            <VoteButtonsCompact
              voteContentType={VoteContentType.Post}
              id={id}
              onVote={onPostVote}
              counts={counts}
              enableDownvotes={enableDownvotes}
              voteDisplayMode={voteDisplayMode}
              myVote={my_vote}
            />
          )}
        </div>
      </>
    );
  }

  qrCodeLine() {
    return (
      <div className="qr-code-line mt-2 d-flex justify-content-center border-top border-light">
        {this.state.qrCodeDataUrl && (
          <div className="d-flex flex-column align-items-center">
            <p className="qr-code-text text-center h6 mt-2">
              From cyberbus with hack
            </p>
            <img
              src={this.state.qrCodeDataUrl}
              alt="Post QR Code"
              className="qr-code-image mb-2 mt-2"
            />
            <p className="qr-code-text text-center">{this.state.postUrl}</p>
          </div>
        )}
      </div>
    );
  }

  public get linkTarget(): string {
    return UserService.Instance.myUserInfo?.local_user_view.local_user
      .open_links_in_new_tab
      ? "_blank"
      : // _self is the default target on links when the field is not specified
        "_self";
  }

  get commentsButton() {
    const pv = this.postView;
    const title = I18NextService.i18n.t("number_of_comments", {
      count: Number(pv.counts.comments),
      formattedCount: Number(pv.counts.comments),
    });

    return (
      <Link
        className="post-button font-weight-bold post-button-background mr-sm-3"
        title={title}
        to={`/post/${pv.post.id}?scrollToComments=true`}
        data-tippy-content={title}
        onClick={this.props.onScrollIntoCommentsClick}
      >
        <BigIcon icon="message-square" classes="me-1 text-muted" inline />
        {pv.counts.comments}
        {this.unreadCount && (
          <>
            {" "}
            <span className="fst-italic">
              ({this.unreadCount} {I18NextService.i18n.t("new")})
            </span>
          </>
        )}
      </Link>
    );
  }

  get unreadCount(): number | undefined {
    const pv = this.postView;
    return pv.unread_comments === pv.counts.comments || pv.unread_comments === 0
      ? undefined
      : pv.unread_comments;
  }

  get viewSourceButton() {
    return (
      <button
        className="btn btn-lg btn-link btn-animate text-muted py-0"
        onClick={linkEvent(this, this.handleViewSource)}
        data-tippy-content={I18NextService.i18n.t("view_source")}
        aria-label={I18NextService.i18n.t("view_source")}
      >
        <Icon
          icon="file-text"
          classes={classNames({ "text-success": this.state.viewSource })}
          inline
        />
      </button>
    );
  }

  mobileThumbnail() {
    return (
      <div className="row">
        <div className="">{this.postTitleLine()}</div>
      </div>
    );
  }

  showPreviewButton() {
    return (
      <button
        type="button"
        className="btn btn-lg btn-link link-dark link-opacity-75 link-opacity-100-hover py-0 align-baseline"
        onClick={linkEvent(this, this.handleShowBody)}
      >
        <Icon
          icon={!this.state.showBody ? "plus-square" : "minus-square"}
          classes="icon-inline"
        />
      </button>
    );
  }

  postTitleFull() {
    const post = this.postView.post;

    return (
      <>
        {/* The mobile view*/}
        <div className="d-block d-sm-none">
          <article className="row post-container">
            <div className="col-auto-without-padding">
              <div className="d-flex post-listing-nav-bar min-h-2rem mb-2 post-title-full">
                {this.createdLine()}
                {this.showMoreButtons()}
              </div>

              {/* If it has a thumbnail, do a right aligned thumbnail */}
              {this.mobileThumbnail()}

              {this.duplicatesLine()}
            </div>
          </article>
        </div>

        {/* The larger view*/}
        <div className="d-none d-sm-block">
          <article className="row post-container">
            <div className="flex-grow-1">
              <div className="row">
                <div className="flex-grow-1">
                  <div className="d-flex post-listing-nav-bar min-h-2rem mb-2 post-title-full">
                    {this.createdLine()}
                    {this.showMoreButtons()}
                  </div>
                  <a
                    href={`/post/${post.id}`}
                    className="text-neutral-content visited:text-neutral-content-weak"
                  >
                    {this.postTitleLine()}
                  </a>
                </div>
              </div>
            </div>
          </article>
        </div>
      </>
    );
  }

  postTitle() {
    const post = this.postView.post;

    return (
      <>
        {/* The mobile view*/}
        <div className="d-block d-sm-none">
          <article className="row post-container">
            <div className="">
              {this.createdLineForPostListing()}

              {/* If it has a thumbnail, do a right aligned thumbnail */}
              {this.mobileThumbnail()}

              {this.duplicatesLine()}
            </div>
          </article>
        </div>

        {/* The larger view*/}
        <div className="d-none d-sm-block">
          <article className="row post-container">
            <div className="flex-grow-1">
              <div className="row">
                <div className="flex-grow-1">
                  <div className="d-flex post-listing-nav-bar min-h-2rem mb-2 post-title">
                    {this.createdLineForPostListing()}
                    {this.showMoreButtons()}
                  </div>
                  <a
                    href={`/post/${post.id}`}
                    className="text-neutral-content visited:text-neutral-content-weak"
                  >
                    {this.postTitleLine()}
                  </a>
                </div>
              </div>
            </div>
          </article>
        </div>
      </>
    );
  }

  showMoreButtons() {
    const { admins, moderators } = this.props;
    return (
      <div className="d-flex align-items-center justify-content-start flex-wrap text-muted">
        {UserService.Instance.myUserInfo && this.isInteractable && (
          <PostActionDropdown
            postView={this.postView}
            admins={admins}
            moderators={moderators}
            crossPostParams={this.crossPostParams}
            onSave={this.handleSavePost}
            onReport={this.handleReport}
            onBlock={this.handleBlockPerson}
            onEdit={this.handleEditClick}
            onDelete={this.handleDeletePost}
            onLock={this.handleModLock}
            onFeatureCommunity={this.handleModFeaturePostCommunity}
            onFeatureLocal={this.handleModFeaturePostLocal}
            onRemove={this.handleRemove}
            onBanFromCommunity={this.handleModBanFromCommunity}
            onAppointCommunityMod={this.handleAppointCommunityMod}
            onTransferCommunity={this.handleTransferCommunity}
            onBanFromSite={this.handleModBanFromSite}
            onPurgeUser={this.handlePurgePerson}
            onPurgeContent={this.handlePurgePost}
            onAppointAdmin={this.handleAppointAdmin}
            onHidePost={this.handleHidePost}
            showShareAsImageOptions={this.props.showFull} // 新增这一行
          />
        )}
      </div>
    );
  }

  handleEditClick() {
    this.setState({ showEdit: true });
  }

  handleEditCancel() {
    this.setState({ showEdit: false });
  }

  handleVideoLoadStart(_i: PostListing, e: Event) {
    const video = e.target as HTMLVideoElement;
    const volume = localStorage.getItem("video_volume_level");
    const muted = localStorage.getItem("video_muted");
    video.volume = Number(volume || 0);
    video.muted = muted !== "false";
    if (!(volume || muted)) {
      localStorage.setItem("video_muted", "true");
      localStorage.setItem("volume_level", "0");
    }
  }

  handleVideoVolumeChange(_i: PostListing, e: Event) {
    const video = e.target as HTMLVideoElement;
    localStorage.setItem("video_muted", video.muted.toString());
    localStorage.setItem("video_volume_level", video.volume.toString());
  }

  // The actual editing is done in the receive for post
  async handleEditPost(form: EditPost) {
    this.setState({ loading: true });
    const res = await this.props.onPostEdit(form);

    if (res.state === "success") {
      toast(I18NextService.i18n.t("edited_post"));
      this.setState({ loading: false, showEdit: false });
    } else if (res.state === "failed") {
      toast(I18NextService.i18n.t(res.err.message), "danger");
      this.setState({ loading: false });
    }
  }

  handleShare(i: PostListing) {
    const { name, body, id } = i.postView.post;
    share({
      title: name,
      text: body?.slice(0, 50),
      url: `${getHttpBase()}/post/${id}`,
    });
  }

  handleReport(reason: string) {
    return this.props.onPostReport({
      post_id: this.postView.post.id,
      reason,
    });
  }

  handleBlockPerson() {
    return this.props.onBlockPerson({
      person_id: this.postView.creator.id,
      block: true,
    });
  }

  handleDeletePost() {
    return this.props.onDeletePost({
      post_id: this.postView.post.id,
      deleted: !this.postView.post.deleted,
    });
  }

  handleSavePost() {
    return this.props.onSavePost({
      post_id: this.postView.post.id,
      save: !this.postView.saved,
    });
  }

  get crossPostParams(): CrossPostParams {
    const { name, url, alt_text, nsfw, language_id } = this.postView.post;
    const crossPostParams: CrossPostParams = { name };

    if (url) {
      crossPostParams.url = url;
    }

    const crossPostBody = this.crossPostBody();
    if (crossPostBody) {
      crossPostParams.body = crossPostBody;
    }

    if (alt_text) {
      crossPostParams.altText = alt_text;
    }

    if (nsfw) {
      crossPostParams.nsfw = nsfw ? "true" : "false";
    }

    if (language_id !== undefined) {
      crossPostParams.languageId = language_id;
    }

    return crossPostParams;
  }

  crossPostBody(): string | undefined {
    const post = this.postView.post;
    const body = post.body;

    return body
      ? `${I18NextService.i18n.t("cross_posted_from")} ${
          post.ap_id
        }\n\n${body.replace(/^/gm, "> ")}`
      : undefined;
  }

  get showBody(): boolean {
    return this.props.showBody || this.state.showBody;
  }

  handleRemove(reason: string) {
    return this.props.onRemovePost({
      post_id: this.postView.post.id,
      removed: !this.postView.post.removed,
      reason,
    });
  }

  handleModLock() {
    return this.props.onLockPost({
      post_id: this.postView.post.id,
      locked: !this.postView.post.locked,
    });
  }

  handleModFeaturePostLocal() {
    return this.props.onFeaturePost({
      post_id: this.postView.post.id,
      featured: !this.postView.post.featured_local,
      feature_type: "Local",
    });
  }

  handleModFeaturePostCommunity() {
    return this.props.onFeaturePost({
      post_id: this.postView.post.id,
      featured: !this.postView.post.featured_community,
      feature_type: "Community",
    });
  }

  handlePurgePost(reason: string) {
    return this.props.onPurgePost({
      post_id: this.postView.post.id,
      reason,
    });
  }

  handlePurgePerson(reason: string) {
    return this.props.onPurgePerson({
      person_id: this.postView.creator.id,
      reason,
    });
  }

  handleHidePost() {
    return this.props.onHidePost({
      hide: !this.postView.hidden,
      post_ids: [this.postView.post.id],
    });
  }

  handleModBanFromCommunity({
    daysUntilExpires,
    reason,
    shouldRemove,
  }: BanUpdateForm) {
    const {
      creator: { id: person_id },
      creator_banned_from_community,
      community: { id: community_id },
    } = this.postView;
    const ban = !creator_banned_from_community;

    // If its an unban, restore all their data
    if (ban === false) {
      shouldRemove = false;
    }
    const expires = futureDaysToUnixTime(daysUntilExpires);

    return this.props.onBanPersonFromCommunity({
      community_id,
      person_id,
      ban,
      remove_data: shouldRemove,
      reason,
      expires,
    });
  }

  handleModBanFromSite({
    daysUntilExpires,
    reason,
    shouldRemove,
  }: BanUpdateForm) {
    const {
      creator: { id: person_id, banned },
    } = this.postView;
    const ban = !banned;

    // If its an unban, restore all their data
    if (ban === false) {
      shouldRemove = false;
    }
    const expires = futureDaysToUnixTime(daysUntilExpires);

    return this.props.onBanPerson({
      person_id,
      ban,
      remove_data: shouldRemove,
      reason,
      expires,
    });
  }

  handleAppointCommunityMod() {
    return this.props.onAddModToCommunity({
      community_id: this.postView.community.id,
      person_id: this.postView.creator.id,
      added: !this.postView.creator_is_moderator,
    });
  }

  handleAppointAdmin() {
    return this.props.onAddAdmin({
      person_id: this.postView.creator.id,
      added: !this.postView.creator_is_admin,
    });
  }

  handleTransferCommunity() {
    return this.props.onTransferCommunity({
      community_id: this.postView.community.id,
      person_id: this.postView.creator.id,
    });
  }

  handleImageExpandClick(i: PostListing, event: any) {
    event.preventDefault();
    i.setState({ imageExpanded: !i.state.imageExpanded });

    if (myAuth() && !i.postView.read) {
      i.props.onMarkPostAsRead({
        post_ids: [i.postView.post.id],
        read: true,
      });
    }
  }

  handleViewSource(i: PostListing) {
    i.setState({ viewSource: !i.state.viewSource });
  }

  handleShowBody(i: PostListing) {
    i.setState({ showBody: !i.state.showBody });
  }

  get pointsTippy(): string {
    const points = I18NextService.i18n.t("number_of_points", {
      count: Number(this.postView.counts.score),
      formattedCount: Number(this.postView.counts.score),
    });

    const upvotes = I18NextService.i18n.t("number_of_upvotes", {
      count: Number(this.postView.counts.upvotes),
      formattedCount: Number(this.postView.counts.upvotes),
    });

    const downvotes = I18NextService.i18n.t("number_of_downvotes", {
      count: Number(this.postView.counts.downvotes),
      formattedCount: Number(this.postView.counts.downvotes),
    });

    return `${points} • ${upvotes} • ${downvotes}`;
  }

  get canModOnSelf(): boolean {
    return canMod(
      this.postView.creator.id,
      this.props.moderators,
      this.props.admins,
      undefined,
      true,
    );
  }

  get canMod(): boolean {
    return canMod(
      this.postView.creator.id,
      this.props.moderators,
      this.props.admins,
    );
  }

  get canAdmin(): boolean {
    return canAdmin(this.postView.creator.id, this.props.admins);
  }

  get isInteractable() {
    const {
      viewOnly,
      post_view: { banned_from_community },
    } = this.props;

    return !(viewOnly || banned_from_community);
  }

  private handleImageLoad(img: HTMLImageElement, container: Element) {
    // 只有在非完整显示模式下才应用图片截断效果
    if (!this.props.showFull && img.naturalHeight > 540) {
      container.classList.add("overflow-image");
      // 只需要设置一个背景变量即可
      container.style.setProperty("--before-bg", `url(${img.src})`);
    }
  }
}
