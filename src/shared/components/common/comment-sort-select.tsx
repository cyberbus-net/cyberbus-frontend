import { randomStr } from "@utils/helpers";
import { Component, linkEvent } from "inferno";
import { CommentSortType } from "@cyberbus-net/cyberbus-js-client";
import { I18NextService } from "../../services";

interface CommentSortSelectProps {
  sort: CommentSortType;
  onChange?(val: CommentSortType): any;
}

interface CommentSortSelectState {
  sort: CommentSortType;
}

export class CommentSortSelect extends Component<
  CommentSortSelectProps,
  CommentSortSelectState
> {
  private id = `sort-select-${randomStr()}`;
  state: CommentSortSelectState = {
    sort: this.props.sort,
  };

  constructor(props: any, context: any) {
    super(props, context);
  }

  static getDerivedStateFromProps(props: any): CommentSortSelectState {
    return {
      sort: props.sort,
    };
  }

  render() {
    return (
      <>
        <select
          id={this.id}
          name={this.id}
          value={this.state.sort}
          onChange={linkEvent(this, this.handleSortChange)}
          className="sort-select form-select d-inline-block w-auto me-2 mb-2"
          aria-label={I18NextService.i18n.t("sort_type")}
        >
          <option disabled>{I18NextService.i18n.t("sort_type")}</option>
          <option value={"Hot"}>{I18NextService.i18n.t("hot")}</option>,
          <option value={"Controversial"}>
            {I18NextService.i18n.t("controversial")}
          </option>
          <option value={"Top"}>{I18NextService.i18n.t("top")}</option>,
          <option value={"New"}>{I18NextService.i18n.t("new")}</option>
          <option value={"Old"}>{I18NextService.i18n.t("old")}</option>
        </select>
      </>
    );
  }

  handleSortChange(i: CommentSortSelect, event: any) {
    i.props.onChange?.(event.target.value);
  }
}
