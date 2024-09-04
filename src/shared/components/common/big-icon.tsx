import { getStaticDir } from "@utils/env";
import classNames from "classnames";
import { Component } from "inferno";

interface IconProps {
  icon: string;
  classes?: string;
  inline?: boolean;
  small?: boolean;
}

export class BigIcon extends Component<IconProps, any> {
  constructor(props: any, context: any) {
    super(props, context);
  }

  render() {
    return (
      <svg
        className={classNames("big-icon", this.props.classes, {
          "icon-inline": this.props.inline,
          small: this.props.small,
        })}
      >
        <use
          xlinkHref={`${getStaticDir()}/assets/symbols.svg#icon-${
            this.props.icon
          }`}
        ></use>
        <div className="visually-hidden">
          <title>{this.props.icon}</title>
        </div>
      </svg>
    );
  }
}
