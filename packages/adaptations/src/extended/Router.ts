import { adaptState } from "../core/adaptState/adaptState";

type PathsObject = {
  [key: string]: string;
};

type Paths = PathsObject;

class Router<P extends Paths> {
  paths: P;
  currentPath: () => string;
  setCurrentPath: (v: string) => void;

  constructor(paths: P) {
    [this.currentPath, this.setCurrentPath] = adaptState(
      window.location.pathname
    );
    this.paths = paths;
    window.addEventListener("popstate", () => this.route());
    this.route = this.route.bind(this);
    this.navigate = this.navigate.bind(this);
  }

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

  setTitle(title: string) {
    document.title = title;
  }
}

export function adaptRouter<P extends Paths>(paths: P) {
  return new Router(paths);
}
