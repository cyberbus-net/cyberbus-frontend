import { Component } from "inferno";
import { GetSiteResponse } from "lemmy-js-client";
import { statusUrl, frontendRepo, backendRepo } from "../../config";
import { I18NextService } from "../../services";
import { VERSION } from "../../version";

interface FooterProps {
  site?: GetSiteResponse;
}

export class Footer extends Component<FooterProps, any> {
  constructor(props: any, context: any) {
    super(props, context);
  }

  render() {
    return (
      <footer className="app-footer container-lg navbar navbar-expand-md navbar-light navbar-bg p-3">
        <div className="navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <span className="nav-link">©cyberbus</span>
            </li>
            {this.props.site?.version !== VERSION && (
              <li className="nav-item">
                <a target="_blank" className="nav-link" href={frontendRepo}>
                  frontend: {VERSION}
                </a>
              </li>
            )}
            <li className="nav-item">
              <a target="_blank" className="nav-link" href={backendRepo}>
                backend: {this.props.site?.version}
              </a>
            </li>
            <li className="nav-item">
              <a target="_blank" className="nav-link" href={statusUrl}>
                {I18NextService.i18n.t("status")}
              </a>
            </li>
          </ul>
        </div>
      </footer>
    );
  }
}
