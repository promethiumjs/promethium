import {
  AsyncDirective,
  directive,
  DirectiveResult,
  PartInfo,
} from "lit/async-directive.js";
import { TemplateResult } from "lit";
import { Component } from "./renderTemplateFn";
import adaptSyncEffect from "./adaptations/adaptEffect/adaptSyncEffect";

class $ extends AsyncDirective {
  cleanups: (() => void)[];
  props: any = {};
  htmlFn?: () => TemplateResult;
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
    let templateResult: TemplateResult | undefined;
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
    props = props ?? {};
    for (const prop in props) {
      this.props[prop] = props[prop];
    }

    let templateResult: TemplateResult | undefined;
    if (this.Component !== Component) {
      this.Component = Component;
      this.disposeComponent();
      templateResult = this.initializeComponent();
    }

    return templateResult ?? this.htmlFn?.();
  }
}

declare function hFn(Component: () => () => TemplateResult): DirectiveResult;
declare function hFn(Component: Component<{}>): DirectiveResult;
declare function hFn<Type>(
  Component: Component<Type>,
  props: Type extends object ? Parameters<typeof Component>[0] : never,
): DirectiveResult;

const h: typeof hFn = directive($);

export default h;
