import { Component, adaptMemo, adaptState } from "../nqtui";
import { html, TemplateResult } from "lit";
import { choose } from "lit/directives/choose.js";
import { ifDefined } from "lit/directives/if-defined.js";
import type {
  Getter,
  Setter,
} from "../nqtui/adaptations/adaptState/stateTypes";
import { PromethiumNode } from "../nqtui/h";

type PathsObject = {
  [key: string]: string;
};

type Paths = PathsObject;

export default class Router<P extends Paths> {
  paths: P;
  currentPath: Getter<string>;
  setCurrentPath: Setter<string>;

  constructor(paths: P) {
    [this.currentPath, this.setCurrentPath] = adaptState(
      window.location.pathname,
    );
    this.paths = paths;
    window.addEventListener("popstate", () => this.route());
    this.route = this.route.bind(this);
    this.navigate = this.navigate.bind(this);
  }

  Link: Component<{
    to: P[keyof P];
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
    routes: Array<[P[keyof P], () => PromethiumNode]>;
    default?: () => PromethiumNode;
  }> = (props) => {
    return () =>
      html`${choose(this.currentPath(), props.routes, props.default)}`;
  };

  setTitle(title: string) {
    document.title = title;
  }
}
