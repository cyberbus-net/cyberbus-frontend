import { setIsoData } from "@utils/app";
import { getQueryParams } from "@utils/helpers";
import { Component, linkEvent } from "inferno";
import { RouteComponentProps } from "inferno-router/dist/Route";
import { GetSiteResponse } from "@cyberbus-net/cyberbus-js-client";
import { I18NextService } from "../../services";
import {
  EMPTY_REQUEST,
  HttpService,
  LOADING_REQUEST,
  RequestState,
} from "../../services/HttpService";
import { toast } from "../../toast";
import { HtmlTags } from "../common/html-tags";
import { Spinner } from "../common/icon";
import { RouteData } from "../../interfaces";
import { IRoutePropsWithFetch } from "../../routes";
import { simpleScrollMixin } from "../mixins/scroll-mixin";

interface ResendVerifyEmailProps {
  prev?: string;
}

export function getLoginQueryParams(source?: string): ResendVerifyEmailProps {
  return getQueryParams<ResendVerifyEmailProps>(
    {
      prev: (param?: string) => param,
    },
    source,
  );
}

interface State {
  resendRes: RequestState<void>;
  form: {
    email: string;
  };
  siteRes: GetSiteResponse;
  countdown: number;
}

async function handleResendSubmit(i: ResendVerifyEmail, event: any) {
  event.preventDefault();
  const { email } = i.state.form;

  if (email && i.state.countdown === 0) {
    i.setState({ resendRes: LOADING_REQUEST });

    const resendRes = await HttpService.client.sendVerifyEmail({
      email,
    });

    if (resendRes.state === "success") {
      toast(I18NextService.i18n.t("verification_email_sent"), "success");
      i.startCountdown();
    } else {
      toast(I18NextService.i18n.t(resendRes.err.message), "danger");
    }

    i.setState({ resendRes });
  }
}

function handleEmailChange(i: ResendVerifyEmail, event: any) {
  i.setState(prevState => (prevState.form.email = event.target.value.trim()));
}

type ResendVerifyEmailRouteProps = RouteComponentProps<Record<string, never>> &
  ResendVerifyEmailProps;
export type ResendVerifyEmailFetchConfig = IRoutePropsWithFetch<
  RouteData,
  Record<string, never>,
  ResendVerifyEmailProps
>;

@simpleScrollMixin
export class ResendVerifyEmail extends Component<
  ResendVerifyEmailRouteProps,
  State
> {
  private isoData = setIsoData(this.context);
  private countdownTimer: NodeJS.Timeout | null = null;

  state: State = {
    resendRes: EMPTY_REQUEST,
    form: {
      email: "",
    },
    siteRes: this.isoData.site_res,
    countdown: 0,
  };

  get documentTitle(): string {
    return `${I18NextService.i18n.t("resend_verify_email")} - ${this.state.siteRes.site_view.site.name}`;
  }

  render() {
    return (
      <div className="resend-verify-email container-lg">
        <HtmlTags
          title={this.documentTitle}
          path={this.context.router.route.match.url}
        />
        <div className="row">
          <div className="col-12">{this.resendForm()}</div>
        </div>
      </div>
    );
  }

  resendForm() {
    return (
      <div>
        <form onSubmit={linkEvent(this, handleResendSubmit)}>
          <h1 className="h4 text-center mb-3">
            {I18NextService.i18n.t("resend_verify_email")}
          </h1>
          <div className="mb-3 row">
            <label className="col-sm-2 col-form-label" htmlFor="email">
              {I18NextService.i18n.t("email")}
            </label>
            <div className="col-sm-10">
              <input
                type="email"
                className="form-control"
                id="email"
                value={this.state.form.email}
                onInput={linkEvent(this, handleEmailChange)}
                autoComplete="email"
                required
              />
            </div>
          </div>
          <div className="mb-3 row">
            <div className="col-12">
              <button
                type="submit"
                className="btn btn-secondary float-end d-inline-block"
                disabled={
                  this.state.countdown > 0 ||
                  this.state.resendRes.state === "loading"
                }
              >
                {this.state.resendRes.state === "loading" ? (
                  <Spinner />
                ) : this.state.countdown > 0 ? (
                  `${I18NextService.i18n.t("resend_verify_email")} (${this.state.countdown}s)`
                ) : (
                  I18NextService.i18n.t("resend_verify_email")
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  startCountdown() {
    this.setState({ countdown: 60 });
    this.countdownTimer = setInterval(() => {
      this.setState(prev => ({
        countdown: Math.max(0, prev.countdown - 1),
      }));
      if (this.state.countdown === 0 && this.countdownTimer) {
        clearInterval(this.countdownTimer);
      }
    }, 1000);
  }

  componentWillUnmount() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
  }
}
