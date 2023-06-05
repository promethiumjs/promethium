import {
  Component,
  TemplateResult,
  adaptMemo,
  choose,
  ifDefined,
} from "../nqtui";
import { adaptState, html } from "../nqtui";
import type {
  Getter,
  Setter,
} from "../nqtui/adaptations/adaptState/stateTypes";

type PathsArray = ReadonlyArray<string>;

type PathsObject = {
  [key: string]: string;
};

type Paths = PathsArray | PathsObject;

export default class Router<P extends Paths> {
  paths: P;
  currentPath: Getter<string>;
  setCurrentPath: Setter<string>;

  constructor(paths: P) {
    [this.currentPath, this.setCurrentPath] = adaptState(
      window.location.pathname
    );
    this.paths = paths;
    window.addEventListener("popstate", () => this.route);
    this.route = this.route.bind(this);
    this.navigate = this.navigate.bind(this);
  }

  Link: Component<{
    to: P extends PathsArray ? P[number] : P[keyof P];
    content?: TemplateResult | string | number;
    text?: string | number;
    class?: (isActive: boolean) => string;
    style?: (isActive: boolean) => string;
  }> = (props) => {
    const isActive = adaptMemo(() => this.currentPath() === props.to);

    return () =>
      html`<a
        href=${props.to}
        @click=${(e: Event) => {
          e.preventDefault();
          this.navigate(props.to);
        }}
        class=${ifDefined(props.class?.(isActive()))}
        style=${ifDefined(props.style?.(isActive()))}
        >${props.content || props.text}</a
      >`;
  };

  navigate(urlOrDelta: string | number) {
    if (typeof urlOrDelta === "string") {
      history.pushState(null, "", urlOrDelta);
    } else {
      history.go(urlOrDelta);
    }

    this.route();
  }

  route() {
    this.setCurrentPath(window.location.pathname);
  }

  Switch: Component<{
    routes: Array<
      [P extends PathsArray ? P[number] : P[keyof P], () => TemplateResult]
    >;
    default?: () => TemplateResult;
  }> = (props) => {
    return () =>
      html`${choose(this.currentPath(), props.routes, props.default)}`;
  };

  setTitle(title: string) {
    document.title = title;
  }
}
