import { I18NextService } from "../../services";
import { Component } from "inferno";

import { PersonView } from "lemmy-js-client";

import { numToSI } from "@utils/helpers";

interface KarmaProps {
  pv: PersonView;
}

export class Karma extends Component<KarmaProps, any> {
  constructor(props: any, context: any) {
    super(props, context);
  }

  render() {
    const pv = this.props.pv;
    return (
      <>
        <div className="card border-secondary mb-3">
          <div className="card-body">
            <h2 className="h5">{I18NextService.i18n.t("Karma")}</h2>
            <ul className="list-inline mb-2">
              <li className="list-inline-item badge text-bg-secondary">
                {I18NextService.i18n.t("number_of_posts", {
                  count: Number(pv.counts.post_count),
                  formattedCount: numToSI(pv.counts.post_count),
                })}
              </li>
              <li className="list-inline-item badge text-bg-secondary">
                {I18NextService.i18n.t("number_of_comments", {
                  count: Number(pv.counts.comment_count),
                  formattedCount: numToSI(pv.counts.comment_count),
                })}
              </li>
            </ul>
          </div>
        </div>
      </>
    );
  }
}