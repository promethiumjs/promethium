import {
  AsyncDirective,
  directive,
  DirectiveResult,
  PartInfo,
} from "lit/async-directive.js";
import adaptSyncEffect from "./adaptations/adaptEffect/adaptSyncEffect";
import { noChange, nothing, TemplateResult } from "lit";
import { JSX } from "../jsx-runtime";

class $ extends AsyncDirective {
  cleanups: (() => void)[];
  props: any = {};
  htmlFn?: ReturnType<Component>;
  Component?: Component<any>;

  // TODO: only allow directive use in the child position
  // TODO: find out why reconnection doesn't happen
  // TODO: perform prop diffing and stop unnecessary component initialization
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
      adaptSyncEffect(() => {
        this.htmlFn = this.Component?.(this.props);
      }, []),
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

export type ComponentFunctionReturnNotToBeUsedOutsideOfLitHTMLExpressions =
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | TemplateResult
  | DirectiveResult
  | Node
  | typeof nothing
  | typeof noChange
  | Iterable<ComponentFunctionReturnNotToBeUsedOutsideOfLitHTMLExpressions>;

export type Component<T = null> = T extends null
  ? (
      props?: null,
    ) =>
      | (() => ComponentFunctionReturnNotToBeUsedOutsideOfLitHTMLExpressions)
      | null
  : (
      props: T,
    ) =>
      | (() => ComponentFunctionReturnNotToBeUsedOutsideOfLitHTMLExpressions)
      | null;

declare function hFn(
  Component: () => () => ComponentFunctionReturnNotToBeUsedOutsideOfLitHTMLExpressions,
): DirectiveResult;
declare function hFn(Component: Component<{}>): DirectiveResult;
declare function hFn<Type>(
  Component: Component<Type>,
  props: Type extends object ? Parameters<typeof Component>[0] : never,
): DirectiveResult;

const h: typeof hFn = directive($);

export type PromethiumNode =
  | ComponentFunctionReturnNotToBeUsedOutsideOfLitHTMLExpressions
  | JSX.Element;

export default h;
