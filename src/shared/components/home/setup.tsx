import { fetchThemeList, setIsoData } from "@utils/app";
import { Component, linkEvent } from "inferno";
import { Helmet } from "inferno-helmet";
import {
  CreateSite,
  GetSiteResponse,
  LoginResponse,
  Register,
} from "@cyberbus-net/cyberbus-js-client";
import { I18NextService, UserService } from "../../services";
import {
  EMPTY_REQUEST,
  HttpService,
  LOADING_REQUEST,
  RequestState,
} from "../../services/HttpService";
import { Spinner } from "../common/icon";
import PasswordInput from "../common/password-input";
import { SiteForm } from "./site-form";
import { simpleScrollMixin } from "../mixins/scroll-mixin";
import { RouteComponentProps } from "inferno-router/dist/Route";
import { isBrowser } from "@utils/browser";

interface State {
  form: {
    username?: string;
    email?: string;
    password?: string;
    password_verify?: string;
    invite_code?: string;
    show_nsfw: boolean;
    captcha_uuid?: string;
    captcha_answer?: string;
    honeypot?: string;
    answer?: string;
  };
  doneRegisteringUser: boolean;
  registerRes: RequestState<LoginResponse>;
  themeList: string[];
  siteRes: GetSiteResponse;
}

@simpleScrollMixin
export class Setup extends Component<
  RouteComponentProps<Record<string, never>>,
  State
> {
  private isoData = setIsoData(this.context);

  state: State = {
    registerRes: EMPTY_REQUEST,
    themeList: [],
    form: {
      show_nsfw: true,
    },
    doneRegisteringUser: !!UserService.Instance.myUserInfo,
    siteRes: this.isoData.site_res,
  };

  constructor(props: any, context: any) {
    super(props, context);

    this.handleCreateSite = this.handleCreateSite.bind(this);
  }

  async componentWillMount() {
    if (isBrowser()) {
      this.setState({ themeList: await fetchThemeList() });
    }
  }

  get documentTitle(): string {
    return `${I18NextService.i18n.t("setup")} - Lemmy`;
  }

  render() {
    return (
      <div className="home-setup container-lg">
        <Helmet title={this.documentTitle} />
        <div className="row">
          <div className="col-12 offset-lg-3 col-lg-6">
            <h1 className="h4 mb-4">
              {I18NextService.i18n.t("lemmy_instance_setup")}
            </h1>
            {!this.state.doneRegisteringUser ? (
              this.registerUser()
            ) : (
              <SiteForm
                showLocal
                onSaveSite={this.handleCreateSite}
                siteRes={this.state.siteRes}
                themeList={this.state.themeList}
                loading={false}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  registerUser() {
    const siteView = this.state.siteRes.site_view;
    return (
      <form onSubmit={linkEvent(this, this.handleRegisterSubmit)}>
        <h2 className="h5 mb-3">{I18NextService.i18n.t("setup_admin")}</h2>
        <div className="mb-3 row">
          <label className="col-sm-2 col-form-label" htmlFor="username">
            {I18NextService.i18n.t("username")}
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="username"
              value={this.state.form.username}
              onInput={linkEvent(this, this.handleRegisterUsernameChange)}
              required
              minLength={3}
              pattern="[a-zA-Z0-9_]+"
            />
          </div>
        </div>
        <div className="mb-3 row">
          <label className="col-sm-2 col-form-label" htmlFor="email">
            {I18NextService.i18n.t("email")}
          </label>

          <div className="col-sm-10">
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder={I18NextService.i18n.t("optional")}
              value={this.state.form.email}
              onInput={linkEvent(this, this.handleRegisterEmailChange)}
              minLength={3}
            />
          </div>
        </div>
        <div className="mb-3">
          <PasswordInput
            id="password"
            value={this.state.form.password}
            onInput={linkEvent(this, this.handleRegisterPasswordChange)}
            label={I18NextService.i18n.t("password")}
            isNew
          />
        </div>
        <div className="mb-3">
          <PasswordInput
            id="verify-password"
            value={this.state.form.password_verify}
            onInput={linkEvent(this, this.handleRegisterPasswordVerifyChange)}
            label={I18NextService.i18n.t("verify_password")}
            isNew
          />
        </div>
        <div className="mb-3 row">
          <label
            className="col-sm-2 col-form-label"
            htmlFor="register-invite-code"
          >
            {I18NextService.i18n.t("invite_code")}
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              id="register-invite-code"
              className="form-control"
              placeholder={
                siteView.local_site.require_invite_code
                  ? I18NextService.i18n.t("required")
                  : I18NextService.i18n.t("optional")
              }
              value={this.state.form.invite_code}
              onInput={linkEvent(this, this.handleRegisterInviteCodeChange)}
              required={siteView.local_site.require_invite_code}
              minLength={6}
            />
          </div>
        </div>

        <div className="mb-3 row">
          <div className="col-sm-10">
            <button type="submit" className="btn btn-secondary">
              {this.state.registerRes.state === "loading" ? (
                <Spinner />
              ) : (
                I18NextService.i18n.t("sign_up")
              )}
            </button>
          </div>
        </div>
      </form>
    );
  }

  async handleRegisterSubmit(i: Setup, event: any) {
    event.preventDefault();
    i.setState({ registerRes: LOADING_REQUEST });
    const {
      username,
      password_verify,
      password,
      email,
      invite_code,
      show_nsfw,
      captcha_uuid,
      captcha_answer,
      honeypot,
      answer,
    } = i.state.form;

    if (username && password && password_verify) {
      const form: Register = {
        username,
        password,
        password_verify,
        email,
        invite_code,
        show_nsfw,
        captcha_uuid,
        captcha_answer,
        honeypot,
        answer,
      };
      i.setState({
        registerRes: await HttpService.client.register(form),
      });

      if (i.state.registerRes.state === "success") {
        const data = i.state.registerRes.data;

        UserService.Instance.login({ res: data });
        i.setState({ doneRegisteringUser: true });
      }
    }
  }

  async handleCreateSite(form: CreateSite) {
    const createRes = await HttpService.client.createSite(form);
    if (createRes.state === "success") {
      this.props.history.replace("/");
      location.reload();
    }
  }

  handleRegisterUsernameChange(i: Setup, event: any) {
    i.state.form.username = event.target.value.trim();
    i.setState(i.state);
  }

  handleRegisterEmailChange(i: Setup, event: any) {
    i.state.form.email = event.target.value;
    i.setState(i.state);
  }

  handleRegisterPasswordChange(i: Setup, event: any) {
    i.state.form.password = event.target.value;
    i.setState(i.state);
  }

  handleRegisterPasswordVerifyChange(i: Setup, event: any) {
    i.state.form.password_verify = event.target.value;
    i.setState(i.state);
  }

  handleRegisterInviteCodeChange(i: Setup, event: any) {
    i.state.form.invite_code = event.target.value;
    i.setState(i.state);
  }
}
