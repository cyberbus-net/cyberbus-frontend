import {
  commentsToFlatNodes,
  editComment,
  editPost,
  editWith,
  enableDownvotes,
  enableNsfw,
  getDataTypeString,
  postToCommentSortType,
  setIsoData,
  showLocal,
  updatePersonBlock,
  voteDisplayMode,
} from "@utils/app";
import {
  getQueryParams,
  getQueryString,
  getRandomFromList,
  resourcesSettled,
} from "@utils/helpers";
import { scrollMixin } from "../mixins/scroll-mixin";
import type { QueryParams, StringBoolean } from "@utils/types";
import { RouteDataResponse } from "@utils/types";
import { NoOptionI18nKeys } from "i18next";
import { Component, InfernoNode, MouseEventHandler, linkEvent } from "inferno";
import {
  AddAdmin,
  AddModToCommunity,
  BanFromCommunity,
  BanFromCommunityResponse,
  BanPerson,
  BanPersonResponse,
  BlockPerson,
  CommentReplyResponse,
  CommentResponse,
  CreateComment,
  CreateCommentLike,
  CreateCommentReport,
  CreatePostLike,
  CreatePostReport,
  DeleteComment,
  DeletePost,
  DistinguishComment,
  EditComment,
  EditPost,
  FeaturePost,
  GetComments,
  GetCommentsResponse,
  GetPosts,
  GetPostsResponse,
  GetSiteResponse,
  HidePost,
  CyberbusHttp,
  ListingType,
  LockPost,
  MarkCommentReplyAsRead,
  MarkPersonMentionAsRead,
  PaginationCursor,
  PostResponse,
  PurgeComment,
  PurgePerson,
  PurgePost,
  RemoveComment,
  RemovePost,
  SaveComment,
  SavePost,
  SortType,
  SuccessResponse,
  TransferCommunity,
} from "@cyberbus-net/cyberbus-js-client";
import { fetchLimit } from "../../config";
import { Link } from "inferno-router";
import {
  CommentViewType,
  DataType,
  InitialFetchRequest,
} from "../../interfaces";
import { mdToHtml } from "../../markdown";
import { FirstLoadService, I18NextService, UserService } from "../../services";
import {
  EMPTY_REQUEST,
  HttpService,
  LOADING_REQUEST,
  RequestState,
  wrapClient,
} from "../../services/HttpService";
import { tippyMixin } from "../mixins/tippy-mixin";
import { toast } from "../../toast";
import { CommentNodes } from "../comment/comment-nodes";
import { HtmlTags } from "../common/html-tags";
import { Icon } from "../common/icon";
import { SortSelect } from "../common/sort-select";
import { CommunityLink } from "../community/community-link";
import { PostListings } from "../post/post-listings";
import { SiteSidebar } from "./site-sidebar";
import { PaginatorCursor } from "../common/paginator-cursor";
import { getHttpBaseInternal } from "../../utils/env";
import {
  CommentsLoadingSkeleton,
  PostsLoadingSkeleton,
} from "../common/loading-skeleton";
import { RouteComponentProps } from "inferno-router/dist/Route";
import { IRoutePropsWithFetch } from "../../routes";
import { isBrowser, snapToTop } from "@utils/browser";
import { debounce } from "lodash";

interface HomeState {
  postsRes: RequestState<GetPostsResponse>;
  commentsRes: RequestState<GetCommentsResponse>;
  posts: PostView[];
  isLoading: boolean;
  showSubscribedMobile: boolean;
  showSidebarMobile: boolean;
  subscribedCollapsed: boolean;
  tagline?: string;
  siteRes: GetSiteResponse;
  isIsomorphic: boolean;
}

interface HomeProps {
  listingType?: ListingType;
  dataType: DataType;
  sort: SortType;
  pageCursor?: PaginationCursor;
  showHidden?: StringBoolean;
}

type HomeData = RouteDataResponse<{
  postsRes: GetPostsResponse;
  commentsRes: GetCommentsResponse;
}>;

function getDataTypeFromQuery(type?: string): DataType {
  return type ? DataType[type] : DataType.Post;
}

function getListingTypeFromQuery(
  type: string | undefined,
  fallback: ListingType,
): ListingType {
  return type ? (type as ListingType) : fallback;
}

function getSortTypeFromQuery(
  type: string | undefined,
  fallback: SortType,
): SortType {
  return type ? (type as SortType) : fallback;
}

type Fallbacks = {
  sort: SortType;
  listingType: ListingType;
};

export function getHomeQueryParams(
  source: string | undefined,
  siteRes: GetSiteResponse,
): HomeProps {
  const myUserInfo = siteRes.my_user ?? UserService.Instance.myUserInfo;
  const local_user = myUserInfo?.local_user_view.local_user;
  const local_site = siteRes.site_view.local_site;
  return getQueryParams<HomeProps, Fallbacks>(
    {
      sort: getSortTypeFromQuery,
      listingType: getListingTypeFromQuery,
      pageCursor: (cursor?: string) => cursor,
      dataType: getDataTypeFromQuery,
      showHidden: (include?: StringBoolean) => include,
    },
    source,
    {
      sort: local_user?.default_sort_type ?? local_site.default_sort_type,
      listingType:
        local_user?.default_listing_type ??
        local_site.default_post_listing_type,
    },
  );
}

const MobileButton = ({
  textKey,
  show,
  onClick,
}: {
  textKey: NoOptionI18nKeys;
  show: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => (
  <button
    className="btn btn-secondary d-inline-block mb-2 me-3"
    onClick={onClick}
  >
    {I18NextService.i18n.t(textKey)}{" "}
    <Icon icon={show ? `minus-square` : `plus-square`} classes="icon-inline" />
  </button>
);

type HomePathProps = Record<string, never>;
type HomeRouteProps = RouteComponentProps<HomePathProps> & HomeProps;
export type HomeFetchConfig = IRoutePropsWithFetch<
  HomeData,
  HomePathProps,
  HomeProps
>;

@scrollMixin
@tippyMixin
export class Home extends Component<HomeRouteProps, HomeState> {
  private isoData = setIsoData<HomeData>(this.context);
  private initialNextPage?: PaginationCursor;
  state: HomeState = {
    posts: [],
    isLoading: false,
    postsRes: EMPTY_REQUEST,
    commentsRes: EMPTY_REQUEST,
    siteRes: this.isoData.site_res,
    showSubscribedMobile: false,
    showSidebarMobile: false,
    subscribedCollapsed: false,
    isIsomorphic: false,
  };

  loadingSettled(): boolean {
    return resourcesSettled([
      this.props.dataType === DataType.Post
        ? this.state.postsRes
        : this.state.commentsRes,
    ]);
  }

  constructor(props: any, context: any) {
    super(props, context);

    this.handleSortChange = this.handleSortChange.bind(this);
    this.handleListingTypeChange = this.handleListingTypeChange.bind(this);
    this.handleDataTypeChange = this.handleDataTypeChange.bind(this);
    this.handleShowHiddenChange = this.handleShowHiddenChange.bind(this);
    this.handlePageNext = this.handlePageNext.bind(this);
    this.handlePagePrev = this.handlePagePrev.bind(this);

    this.handleCreateComment = this.handleCreateComment.bind(this);
    this.handleEditComment = this.handleEditComment.bind(this);
    this.handleSaveComment = this.handleSaveComment.bind(this);
    this.handleBlockPerson = this.handleBlockPerson.bind(this);
    this.handleDeleteComment = this.handleDeleteComment.bind(this);
    this.handleRemoveComment = this.handleRemoveComment.bind(this);
    this.handleCommentVote = this.handleCommentVote.bind(this);
    this.handleAddModToCommunity = this.handleAddModToCommunity.bind(this);
    this.handleAddAdmin = this.handleAddAdmin.bind(this);
    this.handlePurgePerson = this.handlePurgePerson.bind(this);
    this.handlePurgeComment = this.handlePurgeComment.bind(this);
    this.handleCommentReport = this.handleCommentReport.bind(this);
    this.handleDistinguishComment = this.handleDistinguishComment.bind(this);
    this.handleTransferCommunity = this.handleTransferCommunity.bind(this);
    this.handleCommentReplyRead = this.handleCommentReplyRead.bind(this);
    this.handlePersonMentionRead = this.handlePersonMentionRead.bind(this);
    this.handleBanFromCommunity = this.handleBanFromCommunity.bind(this);
    this.handleBanPerson = this.handleBanPerson.bind(this);
    this.handlePostEdit = this.handlePostEdit.bind(this);
    this.handlePostVote = this.handlePostVote.bind(this);
    this.handlePostReport = this.handlePostReport.bind(this);
    this.handleLockPost = this.handleLockPost.bind(this);
    this.handleDeletePost = this.handleDeletePost.bind(this);
    this.handleRemovePost = this.handleRemovePost.bind(this);
    this.handleSavePost = this.handleSavePost.bind(this);
    this.handlePurgePost = this.handlePurgePost.bind(this);
    this.handleFeaturePost = this.handleFeaturePost.bind(this);
    this.handleHidePost = this.handleHidePost.bind(this);

    if (FirstLoadService.isFirstLoad) {
      const { commentsRes, postsRes } = this.isoData.routeData;

      this.initialNextPage =
        postsRes.state === "success" ? postsRes.data.next_page : undefined;

      this.state = {
        ...this.state,
        commentsRes,
        postsRes,
        posts: postsRes.state === "success" ? postsRes.data.posts : [],
        isIsomorphic: true,
      };
    }

    this.state.tagline = getRandomFromList(
      this.state?.siteRes?.taglines ?? [],
    )?.content;
  }

  async componentWillMount() {
    if (
      (!this.state.isIsomorphic ||
        !Object.values(this.isoData.routeData).some(
          res => res.state === "success" || res.state === "failed",
        )) &&
      isBrowser()
    ) {
      await this.fetchData(this.props);
    }
  }

  componentWillReceiveProps(
    nextProps: HomeRouteProps & { children?: InfernoNode },
  ) {
    this.fetchData(nextProps);
  }

  static async fetchInitialData({
    query: { listingType, dataType, sort, pageCursor, showHidden },
    headers,
  }: InitialFetchRequest<HomePathProps, HomeProps>): Promise<HomeData> {
    const client = wrapClient(
      new CyberbusHttp(getHttpBaseInternal(), { headers }),
    );

    let postsFetch: Promise<RequestState<GetPostsResponse>> =
      Promise.resolve(EMPTY_REQUEST);
    let commentsFetch: Promise<RequestState<GetCommentsResponse>> =
      Promise.resolve(EMPTY_REQUEST);

    if (dataType === DataType.Post) {
      const getPostsForm: GetPosts = {
        type_: listingType,
        page_cursor: pageCursor,
        limit: fetchLimit,
        sort,
        saved_only: false,
        show_hidden: showHidden === "true",
      };

      postsFetch = client.getPosts(getPostsForm);
    } else {
      const getCommentsForm: GetComments = {
        limit: fetchLimit,
        sort: postToCommentSortType(sort),
        type_: listingType,
        saved_only: false,
      };

      commentsFetch = client.getComments(getCommentsForm);
    }

    const [postsRes, commentsRes] = await Promise.all([
      postsFetch,
      commentsFetch,
    ]);

    return {
      commentsRes,
      postsRes,
    };
  }

  get documentTitle(): string {
    const { name, description } = this.state.siteRes.site_view.site;

    return description ? `${name} - ${description}` : name;
  }

  render() {
    const {
      tagline,
      siteRes: {
        site_view: {
          local_site: { site_setup },
        },
      },
    } = this.state;

    return (
      <div className="home container-lg">
        <HtmlTags
          title={this.documentTitle}
          path={this.context.router.route.match.url}
        />
        {site_setup && (
          <div className="row">
            <main role="main" className="col-12 col-md-8 col-lg-8">
              {tagline && (
                <div
                  id="tagline"
                  dangerouslySetInnerHTML={mdToHtml(tagline, () =>
                    this.forceUpdate(),
                  )}
                ></div>
              )}
              {this.posts}
            </main>
            <aside className="d-none d-md-block col-md-4 col-lg-4">
              {this.mySidebar}
            </aside>
          </div>
        )}
      </div>
    );
  }

  get hasFollows(): boolean {
    const mui = UserService.Instance.myUserInfo;
    return !!mui && mui.follows.length > 0;
  }

  get mobileView() {
    const {
      siteRes: {
        site_view: { counts, site },
        admins,
      },
      showSubscribedMobile,
      showSidebarMobile,
    } = this.state;

    return (
      <div className="row">
        <div className="col-12">
          {this.hasFollows && (
            <MobileButton
              textKey="subscribed"
              show={showSubscribedMobile}
              onClick={linkEvent(this, this.handleShowSubscribedMobile)}
            />
          )}
          <MobileButton
            textKey="sidebar"
            show={showSidebarMobile}
            onClick={linkEvent(this, this.handleShowSidebarMobile)}
          />
          {showSidebarMobile && (
            <SiteSidebar
              site={site}
              admins={admins}
              counts={counts}
              showLocal={showLocal(this.isoData)}
              isMobile={true}
            />
          )}
          {showSubscribedMobile && (
            <div className="card mb-3">{this.subscribedCommunities()}</div>
          )}
        </div>
      </div>
    );
  }

  get mySidebar() {
    const {
      siteRes: {
        site_view: { counts, site },
        admins,
      },
    } = this.state;

    return (
      <div id="sidebarContainer">
        <SiteSidebar
          site={site}
          admins={admins}
          counts={counts}
          showLocal={showLocal(this.isoData)}
        />
        {this.hasFollows && (
          <div className="accordion">
            <div className="card mb-3">
              <div className="list-group list-group-flush">
                {this.subscribedCommunities()}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  subscribedCommunities() {
    return (
      <>
        <div className="list-group-item">
          <h2 className="h5">
            <Link className="text-body" to="/communities">
              {I18NextService.i18n.t("communities")}
            </Link>
          </h2>
          <ul className="list-inline mb-2">
            {UserService.Instance.myUserInfo?.follows.map(cfv => (
              <li
                key={cfv.community.id}
                className="list-inline-item badge text-bg-tertiary"
              >
                <CommunityLink community={cfv.community} />
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  }

  async updateUrl(props: Partial<HomeProps>) {
    const { dataType, listingType, pageCursor, sort, showHidden } = {
      ...this.props,
      ...props,
    };
    const queryParams: QueryParams<HomeProps> = {
      dataType: getDataTypeString(dataType ?? DataType.Post),
      listingType: listingType,
      pageCursor: pageCursor,
      sort: sort,
      showHidden: showHidden,
    };

    this.props.history.push({
      pathname: "/",
      search: getQueryString(queryParams),
    });
  }

  get posts() {
    return (
      <div className="main-content-wrapper">
        <div>
          {this.selects}
          <hr className="my-2" />
          {this.listings}

          {/* 底部区域 */}
          <div className="d-flex flex-column align-items-center gap-2">
            {/* 使用静态 nextPage */}
            <PaginatorCursor
              nextPage={this.initialNextPage}
              onNext={this.handlePageNext}
            />

            {/* 加载提示 */}
            {this.state.isLoading && <PostsLoadingSkeleton />}
          </div>
        </div>
      </div>
    );
  }

  get staticNextPage(): PaginationCursor | undefined {
    return this.initialNextPage;
  }

  get listings() {
    const { dataType } = this.props;
    const siteRes = this.state.siteRes;

    if (dataType === DataType.Post) {
      switch (this.state.postsRes?.state) {
        case "empty":
          return <div style="min-height: 20000px;"></div>;
        case "loading":
          return <PostsLoadingSkeleton />;
        case "success": {
          return (
            <PostListings
              posts={this.state.posts}
              showCommunity
              removeDuplicates
              enableDownvotes={enableDownvotes(siteRes)}
              voteDisplayMode={voteDisplayMode(siteRes)}
              enableNsfw={enableNsfw(siteRes)}
              allLanguages={siteRes.all_languages}
              siteLanguages={siteRes.discussion_languages}
              onBlockPerson={this.handleBlockPerson}
              onPostEdit={this.handlePostEdit}
              onPostVote={this.handlePostVote}
              onPostReport={this.handlePostReport}
              onLockPost={this.handleLockPost}
              onDeletePost={this.handleDeletePost}
              onRemovePost={this.handleRemovePost}
              onSavePost={this.handleSavePost}
              onPurgePerson={this.handlePurgePerson}
              onPurgePost={this.handlePurgePost}
              onBanPerson={this.handleBanPerson}
              onBanPersonFromCommunity={this.handleBanFromCommunity}
              onAddModToCommunity={this.handleAddModToCommunity}
              onAddAdmin={this.handleAddAdmin}
              onTransferCommunity={this.handleTransferCommunity}
              onFeaturePost={this.handleFeaturePost}
              onMarkPostAsRead={async () => {}}
              onHidePost={this.handleHidePost}
            />
          );
        }
      }
    } else {
      switch (this.state.commentsRes.state) {
        case "loading":
          return <CommentsLoadingSkeleton />;
        case "success": {
          const comments = this.state.commentsRes.data.comments;
          return (
            <CommentNodes
              nodes={commentsToFlatNodes(comments)}
              viewType={CommentViewType.Flat}
              isTopLevel
              showCommunity
              showContext
              enableDownvotes={enableDownvotes(siteRes)}
              voteDisplayMode={voteDisplayMode(siteRes)}
              allLanguages={siteRes.all_languages}
              siteLanguages={siteRes.discussion_languages}
              onSaveComment={this.handleSaveComment}
              onBlockPerson={this.handleBlockPerson}
              onDeleteComment={this.handleDeleteComment}
              onRemoveComment={this.handleRemoveComment}
              onCommentVote={this.handleCommentVote}
              onCommentReport={this.handleCommentReport}
              onDistinguishComment={this.handleDistinguishComment}
              onAddModToCommunity={this.handleAddModToCommunity}
              onAddAdmin={this.handleAddAdmin}
              onTransferCommunity={this.handleTransferCommunity}
              onPurgeComment={this.handlePurgeComment}
              onPurgePerson={this.handlePurgePerson}
              onCommentReplyRead={this.handleCommentReplyRead}
              onPersonMentionRead={this.handlePersonMentionRead}
              onBanPersonFromCommunity={this.handleBanFromCommunity}
              onBanPerson={this.handleBanPerson}
              onCreateComment={this.handleCreateComment}
              onEditComment={this.handleEditComment}
            />
          );
        }
      }
    }
  }

  get selects() {
    const { sort } = this.props;

    return (
      <div className="row align-items-center">
        <div className="">
          <SortSelect sort={sort} onChange={this.handleSortChange} />
        </div>
      </div>
    );
  }

  fetchDataToken?: symbol;
  async fetchData({
    dataType,
    pageCursor,
    listingType,
    sort,
    showHidden,
  }: HomeProps) {
    const token = (this.fetchDataToken = Symbol());
    if (dataType === DataType.Post) {
      this.setState({ postsRes: LOADING_REQUEST, commentsRes: EMPTY_REQUEST });
      const postsRes = await HttpService.client.getPosts({
        page_cursor: pageCursor,
        limit: fetchLimit,
        sort,
        saved_only: false,
        type_: listingType,
        show_hidden: showHidden === "true",
      });
      if (token === this.fetchDataToken) {
        this.setState({
          postsRes,
          posts: postsRes.state === "success" ? postsRes.data.posts : [],
        });
      }
    } else {
      this.setState({ commentsRes: LOADING_REQUEST, postsRes: EMPTY_REQUEST });
      const commentsRes = await HttpService.client.getComments({
        limit: fetchLimit,
        sort: postToCommentSortType(sort),
        saved_only: false,
        type_: listingType,
      });
      if (token === this.fetchDataToken) {
        this.setState({ commentsRes });
      }
    }
  }

  handleShowSubscribedMobile(i: Home) {
    i.setState({ showSubscribedMobile: !i.state.showSubscribedMobile });
  }

  handleShowSidebarMobile(i: Home) {
    i.setState({ showSidebarMobile: !i.state.showSidebarMobile });
  }

  handleCollapseSubscribe(i: Home) {
    i.setState({ subscribedCollapsed: !i.state.subscribedCollapsed });
  }

  handlePagePrev() {
    this.props.history.back();
    // A hack to scroll to top
    setTimeout(() => {
      snapToTop();
    }, 50);
  }

  handlePageNext(nextPage: PaginationCursor) {
    this.updateUrl({ pageCursor: nextPage });
  }

  handleSortChange(val: SortType) {
    this.updateUrl({ sort: val, pageCursor: undefined });
  }

  handleListingTypeChange(val: ListingType) {
    this.updateUrl({ listingType: val, pageCursor: undefined });
  }

  handleDataTypeChange(val: DataType) {
    this.updateUrl({ dataType: val, pageCursor: undefined });
  }

  handleShowHiddenChange(show?: StringBoolean) {
    this.updateUrl({
      showHidden: show,
      pageCursor: undefined,
    });
  }

  async handleAddModToCommunity(form: AddModToCommunity) {
    // TODO not sure what to do here
    await HttpService.client.addModToCommunity(form);
  }

  async handlePurgePerson(form: PurgePerson) {
    const purgePersonRes = await HttpService.client.purgePerson(form);
    this.purgeItem(purgePersonRes);
  }

  async handlePurgeComment(form: PurgeComment) {
    const purgeCommentRes = await HttpService.client.purgeComment(form);
    this.purgeItem(purgeCommentRes);
  }

  async handlePurgePost(form: PurgePost) {
    const purgeRes = await HttpService.client.purgePost(form);
    this.purgeItem(purgeRes);
  }

  async handleBlockPerson(form: BlockPerson) {
    const blockPersonRes = await HttpService.client.blockPerson(form);
    if (blockPersonRes.state === "success") {
      updatePersonBlock(blockPersonRes.data);
    }
  }

  async handleCreateComment(form: CreateComment) {
    const createCommentRes = await HttpService.client.createComment(form);
    this.createAndUpdateComments(createCommentRes);

    if (createCommentRes.state === "failed") {
      toast(I18NextService.i18n.t(createCommentRes.err.message), "danger");
    }
    return createCommentRes;
  }

  async handleEditComment(form: EditComment) {
    const editCommentRes = await HttpService.client.editComment(form);
    this.findAndUpdateCommentEdit(editCommentRes);

    if (editCommentRes.state === "failed") {
      toast(I18NextService.i18n.t(editCommentRes.err.message), "danger");
    }
    return editCommentRes;
  }

  async handleDeleteComment(form: DeleteComment) {
    const deleteCommentRes = await HttpService.client.deleteComment(form);
    this.findAndUpdateComment(deleteCommentRes);
  }

  async handleDeletePost(form: DeletePost) {
    const deleteRes = await HttpService.client.deletePost(form);
    this.findAndUpdatePost(deleteRes);
  }

  async handleRemovePost(form: RemovePost) {
    const removeRes = await HttpService.client.removePost(form);
    this.findAndUpdatePost(removeRes);
  }

  async handleRemoveComment(form: RemoveComment) {
    const removeCommentRes = await HttpService.client.removeComment(form);
    this.findAndUpdateComment(removeCommentRes);
  }

  async handleSaveComment(form: SaveComment) {
    const saveCommentRes = await HttpService.client.saveComment(form);
    this.findAndUpdateComment(saveCommentRes);
  }

  async handleSavePost(form: SavePost) {
    const saveRes = await HttpService.client.savePost(form);
    this.findAndUpdatePost(saveRes);
  }

  async handleFeaturePost(form: FeaturePost) {
    const featureRes = await HttpService.client.featurePost(form);
    this.findAndUpdatePost(featureRes);
  }

  async handleCommentVote(form: CreateCommentLike) {
    const voteRes = await HttpService.client.likeComment(form);
    this.findAndUpdateComment(voteRes);
  }

  async handlePostEdit(form: EditPost) {
    const res = await HttpService.client.editPost(form);
    this.findAndUpdatePost(res);
    return res;
  }

  async handlePostVote(form: CreatePostLike) {
    const voteRes = await HttpService.client.likePost(form);
    this.findAndUpdatePost(voteRes);
    return voteRes;
  }

  async handleCommentReport(form: CreateCommentReport) {
    const reportRes = await HttpService.client.createCommentReport(form);
    if (reportRes.state === "success") {
      toast(I18NextService.i18n.t("report_created"));
    }
  }

  async handlePostReport(form: CreatePostReport) {
    const reportRes = await HttpService.client.createPostReport(form);
    if (reportRes.state === "success") {
      toast(I18NextService.i18n.t("report_created"));
    }
  }

  async handleLockPost(form: LockPost) {
    const lockRes = await HttpService.client.lockPost(form);
    this.findAndUpdatePost(lockRes);
  }

  async handleDistinguishComment(form: DistinguishComment) {
    const distinguishRes = await HttpService.client.distinguishComment(form);
    this.findAndUpdateComment(distinguishRes);
  }

  async handleAddAdmin(form: AddAdmin) {
    const addAdminRes = await HttpService.client.addAdmin(form);

    if (addAdminRes.state === "success") {
      this.setState(s => ((s.siteRes.admins = addAdminRes.data.admins), s));
    }
  }

  async handleTransferCommunity(form: TransferCommunity) {
    await HttpService.client.transferCommunity(form);
    toast(I18NextService.i18n.t("transfer_community"));
  }

  async handleCommentReplyRead(form: MarkCommentReplyAsRead) {
    const readRes = await HttpService.client.markCommentReplyAsRead(form);
    this.findAndUpdateCommentReply(readRes);
  }

  async handlePersonMentionRead(form: MarkPersonMentionAsRead) {
    // TODO not sure what to do here. Maybe it is actually optional, because post doesn't need it.
    await HttpService.client.markPersonMentionAsRead(form);
  }

  async handleBanFromCommunity(form: BanFromCommunity) {
    const banRes = await HttpService.client.banFromCommunity(form);
    this.updateBanFromCommunity(banRes);
  }

  async handleBanPerson(form: BanPerson) {
    const banRes = await HttpService.client.banPerson(form);
    this.updateBan(banRes);
  }

  async handleHidePost(form: HidePost) {
    const hideRes = await HttpService.client.hidePost(form);

    if (hideRes.state === "success") {
      this.setState(prev => {
        if (prev.postsRes.state === "success") {
          for (const post of prev.postsRes.data.posts.filter(p =>
            form.post_ids.some(id => id === p.post.id),
          )) {
            post.hidden = form.hide;
          }
        }

        return prev;
      });

      toast(I18NextService.i18n.t(form.hide ? "post_hidden" : "post_unhidden"));
    }
  }

  updateBanFromCommunity(banRes: RequestState<BanFromCommunityResponse>) {
    // Maybe not necessary
    if (banRes.state === "success") {
      this.setState(s => {
        if (s.postsRes.state === "success") {
          s.postsRes.data.posts
            .filter(c => c.creator.id === banRes.data.person_view.person.id)
            .forEach(
              c => (c.creator_banned_from_community = banRes.data.banned),
            );
        }
        if (s.commentsRes.state === "success") {
          s.commentsRes.data.comments
            .filter(c => c.creator.id === banRes.data.person_view.person.id)
            .forEach(
              c => (c.creator_banned_from_community = banRes.data.banned),
            );
        }
        return s;
      });
    }
  }

  updateBan(banRes: RequestState<BanPersonResponse>) {
    // Maybe not necessary
    if (banRes.state === "success") {
      this.setState(s => {
        if (s.postsRes.state === "success") {
          s.postsRes.data.posts
            .filter(c => c.creator.id === banRes.data.person_view.person.id)
            .forEach(c => (c.creator.banned = banRes.data.banned));
        }
        if (s.commentsRes.state === "success") {
          s.commentsRes.data.comments
            .filter(c => c.creator.id === banRes.data.person_view.person.id)
            .forEach(c => (c.creator.banned = banRes.data.banned));
        }
        return s;
      });
    }
  }

  purgeItem(purgeRes: RequestState<SuccessResponse>) {
    if (purgeRes.state === "success") {
      toast(I18NextService.i18n.t("purge_success"));
      this.context.router.history.push(`/`);
    }
  }

  findAndUpdateCommentEdit(res: RequestState<CommentResponse>) {
    this.setState(s => {
      if (s.commentsRes.state === "success" && res.state === "success") {
        s.commentsRes.data.comments = editComment(
          res.data.comment_view,
          s.commentsRes.data.comments,
        );
      }
      return s;
    });
  }

  findAndUpdateComment(res: RequestState<CommentResponse>) {
    this.setState(s => {
      if (s.commentsRes.state === "success" && res.state === "success") {
        s.commentsRes.data.comments = editComment(
          res.data.comment_view,
          s.commentsRes.data.comments,
        );
      }
      return s;
    });
  }

  createAndUpdateComments(res: RequestState<CommentResponse>) {
    this.setState(s => {
      if (s.commentsRes.state === "success" && res.state === "success") {
        s.commentsRes.data.comments.unshift(res.data.comment_view);
      }
      return s;
    });
  }

  findAndUpdateCommentReply(res: RequestState<CommentReplyResponse>) {
    this.setState(s => {
      if (s.commentsRes.state === "success" && res.state === "success") {
        s.commentsRes.data.comments = editWith(
          res.data.comment_reply_view,
          s.commentsRes.data.comments,
        );
      }
      return s;
    });
  }

  findAndUpdatePost(res: RequestState<PostResponse>) {
    this.setState(s => {
      if (s.postsRes.state === "success" && res.state === "success") {
        s.postsRes.data.posts = editPost(
          res.data.post_view,
          s.postsRes.data.posts,
        );
      }
      return s;
    });
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = debounce(() => {
    if (
      window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 500 &&
      !this.state.isLoading &&
      this.getNextPage
    ) {
      this.loadMorePosts();
    }
  }, 200);

  async loadMorePosts() {
    const { listingType, sort, showHidden } = this.props;

    this.setState({ isLoading: true });

    try {
      const postsRes = await HttpService.client.getPosts({
        page_cursor: this.getNextPage,
        limit: fetchLimit,
        sort,
        saved_only: false,
        type_: listingType,
        show_hidden: showHidden === "true",
      });

      if (postsRes.state === "success") {
        this.setState(prevState => ({
          posts: [...prevState.posts, ...postsRes.data.posts],
          postsRes: {
            ...postsRes,
            data: {
              ...postsRes.data,
              next_page: postsRes.data.next_page,
            },
          },
        }));
      }
    } finally {
      this.setState({ isLoading: false });
    }
  }

  get getNextPage(): PaginationCursor | undefined {
    return this.state.postsRes.state === "success"
      ? this.state.postsRes.data.next_page
      : undefined;
  }
}
