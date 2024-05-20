import {
  AsyncDirective,
  directive,
  DirectiveResult,
  PartInfo,
} from "lit/async-directive.js";
import adaptSyncEffect from "./adaptations/adaptEffect/adaptSyncEffect";
import { noChange } from "lit";
import { untrack } from "./adaptations/adaptState/utils";

class $ extends AsyncDirective {
  cleanups: (() => void)[];
  props: any = {};
  htmlFn?: () => unknown;
  Component?: Component<any>;

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

  initializeComponent() {
    //initialize component effects and memos and store the 1st cleanup
    this.cleanups.push(
      adaptSyncEffect(() => {
        this.htmlFn = this.Component?.(this.props);
      }, []),
    );
    let templateResult: unknown;
    let updateFromLit = true;
    const componentCleanup = adaptSyncEffect(() => {
      templateResult = this.htmlFn?.();
      if (updateFromLit === false) {
        this.setValue(templateResult);
      }
    });
    updateFromLit = false;
    //store 2nd cleanup
    this.cleanups.push(componentCleanup);

    return templateResult;
  }

  protected reconnected() {
    this.initializeComponent();
  }

  render(Component: Component<any>, props?: any) {
    let propChanged = false;
    props = props ?? {};
    for (const prop in props) {
      if (this.props[prop] !== props[prop]) {
        propChanged = true;
        this.props[prop] = props[prop];
      }
    }

    let templateResult: unknown;
    let firstRenderPass = false;
    if (this.Component !== Component) {
      firstRenderPass = true;
      this.Component = Component;
      this.disposeComponent();
      templateResult = this.initializeComponent();
    }

    if (propChanged || firstRenderPass) {
      return templateResult ?? untrack(this.htmlFn!);
    } else {
      return noChange;
    }
  }
}

export type Component<T = null> = T extends null
  ? (props?: null) => () => unknown
  : (props: T) => () => unknown;

declare function hFn(Component: () => () => unknown): DirectiveResult;
declare function hFn(Component: Component<{}>): DirectiveResult;
declare function hFn<Type>(
  Component: Component<Type>,
  props: Type extends object ? Parameters<typeof Component>[0] : never,
): DirectiveResult;

const h: typeof hFn = directive($);

export default h;
