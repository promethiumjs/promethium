import { adaptMemo, adaptState } from "../nqtui";
import { html } from "lit";
import { choose } from "lit/directives/choose.js";
import { ifDefined } from "lit/directives/if-defined.js";
export default class Router {
    constructor(paths) {
        this.Link = (props) => {
            const isActive = adaptMemo(() => this.currentPath() === props.to);
            return () => {
                var _a, _b;
                return html `<a
        href=${props.to}
        @click=${(e) => {
                    e.preventDefault();
                    this.navigate(props.to);
                }}
        class=${ifDefined((_a = props.class) === null || _a === void 0 ? void 0 : _a.call(props, isActive()))}
        style=${ifDefined((_b = props.style) === null || _b === void 0 ? void 0 : _b.call(props, isActive()))}
        >${props.content || props.text}</a
      >`;
            };
        };
        this.Switch = (props) => {
            return () => html `${choose(this.currentPath(), props.routes, props.default)}`;
        };
        [this.currentPath, this.setCurrentPath] = adaptState(window.location.pathname);
        this.paths = paths;
        window.addEventListener("popstate", () => this.route());
        this.route = this.route.bind(this);
        this.navigate = this.navigate.bind(this);
    }
    navigate(urlOrDelta) {
        if (typeof urlOrDelta === "string") {
            history.pushState(null, "", urlOrDelta);
        }
        else {
            history.go(urlOrDelta);
        }
        this.route();
    }
    route() {
        this.setCurrentPath(window.location.pathname);
    }
    setTitle(title) {
        document.title = title;
    }
}
