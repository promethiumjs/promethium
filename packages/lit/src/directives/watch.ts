import { directive } from "lit/directive.js";
import { AsyncDirective } from "lit/async-directive.js";
import { Getter, adaptSyncEffect } from "@promethium-js/adaptations";

class WatchDirective extends AsyncDirective {
  private stateGetter?: Getter<unknown>;
  private cleanup?: () => void;

  // TODO: add support for a default value(similar to nullish coalescing)
  render(stateGetter: Getter<unknown>) {
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
    this.cleanup = adaptSyncEffect(
      () => {
        this.setValue(this.stateGetter?.());
      },
      [this.stateGetter!],
      { defer },
    );
  }
}

export const watch = directive(WatchDirective);
