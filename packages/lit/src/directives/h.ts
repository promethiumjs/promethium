import {
  AsyncDirective,
  directive,
  DirectiveResult,
  PartInfo,
} from "lit/async-directive.js";
import { adaptSyncEffect } from "@promethium-js/adaptations";

class $ extends AsyncDirective {
  cleanups: (() => void)[];
  props: any = {};
  htmlFn?: ReturnType<Component>;
  Component?: Component<any>;

  // TODO: only allow directive use in the child position
  // TODO: find out why reconnection doesn't happen
  // TODO: perform prop diffing and stop unnecessary component re-initialization
  // TODO: make properties private
  constructor(partInfo: PartInfo) {
    super(partInfo);

    //initialize cleanups for component. this includes:
    //1. general component cleanup for all its effects and memos
    //2. cleanup of the effect created from the function (that returns a template result) the component returns
    this.cleanups = [];
  }

  disposeComponent() {
    this.cleanups.forEach((cleanup) => cleanup());
    this.cleanups = [];
  }

  protected disconnected() {
    this.disposeComponent();
  }

  initializeComponent(reconnected: boolean = false) {
    //initialize component effects and memos and store the 1st cleanup
    this.cleanups.push(
      adaptSyncEffect(
        () => {
          this.htmlFn = this.Component?.(this.props);
        },
        { deps: [] }
      )
    );
    let templateResult: unknown;
    let updateFromLit = true;
    const componentCleanup = adaptSyncEffect(() => {
      templateResult = this.htmlFn?.();
      if (updateFromLit === false || reconnected === true) {
        this.setValue(templateResult);
      }
    });
    updateFromLit = false;
    //store 2nd cleanup
    this.cleanups.push(componentCleanup);

    return templateResult;
  }

  protected reconnected() {
    this.initializeComponent(true);
  }

  render(Component: Component<any>, props?: any) {
    for (const prop in props) {
      this.props[prop] = props[prop];
    }
    this.Component = Component;
    this.disposeComponent();
    const templateResult = this.initializeComponent();

    return templateResult;
  }
}

export type Component<T = null> = T extends null
  ? (props?: null) => (() => unknown) | null
  : (props: T) => (() => unknown) | null;

declare function hFn(Component: () => () => unknown): DirectiveResult;
declare function hFn(Component: Component<{}>): DirectiveResult;
declare function hFn<Type>(
  Component: Component<Type>,
  props: Type extends object ? Parameters<typeof Component>[0] : never
): DirectiveResult;

export const h: typeof hFn = directive($);
