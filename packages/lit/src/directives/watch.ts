import { directive } from "lit/directive.js";
import { AsyncDirective } from "lit/async-directive.js";
import { adaptEffect } from "@promethium-js/adaptations";

class WatchDirective extends AsyncDirective {
  private stateGetter?: () => unknown;
  private cleanup?: () => void;

  // TODO: add support for a default value(similar to nullish coalescing)
  render(stateGetter: () => unknown) {
    if (stateGetter !== this.stateGetter) {
      this.cleanup?.();
      this.stateGetter = stateGetter;
      this.subscribeToStateGetter(true);
    }

    return stateGetter();
  }

  disconnected() {
    this.cleanup?.();
  }

  reconnected(): void {
    // don't defer effect execution on reconnect
    this.subscribeToStateGetter();
  }

  subscribeToStateGetter(defer: boolean = false) {
    this.cleanup = adaptEffect(
      () => {
        this.setValue(this.stateGetter?.());
      },
      { deps: () => this.stateGetter?.(), defer }
    ).dispose;
  }
}

export const watch = directive(WatchDirective);
