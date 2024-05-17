import {
  AsyncDirective,
  directive,
  DirectiveResult,
  PartInfo,
} from "lit/async-directive.js";
import { ChildPart, html, TemplateResult } from "lit";
import { Component } from "./renderTemplateFn";
import adaptSyncEffect from "./adaptations/adaptEffect/adaptSyncEffect";

class $ extends AsyncDirective {
  updateFlag: "initialize" | "updateProps";
  cleanups: (() => void)[];
  props: any;
  htmlFn: () => TemplateResult;

  constructor(partInfo: PartInfo) {
    super(partInfo);

    //boolean flag to enable initialization of the component in the update method.
    this.updateFlag = "initialize";
    //initialize cleanups for component. this includes:
    //1. general component cleanup for all its effects and memos
    //2. cleanup of the effect created from the function (that returns a template result) the component returns
    this.cleanups = [];
    this.htmlFn = () => html``;
  }

  protected disconnected() {
    this.cleanups.forEach((cleanup) => cleanup());
  }

  //first time initialization of component
  initialize(
    props: any,
    _: ChildPart,
    Component: (props: any) => () => TemplateResult,
  ) {
    this.props = props;

    return this.initializeComponent(Component, this.props);
  }

  initializeComponent(
    Component: (props: any) => () => TemplateResult,
    props: any,
  ) {
    //initialize component effects and memos and store the 1st cleanup
    this.cleanups.push(
      adaptSyncEffect(() => {
        this.htmlFn = Component(props);
      }, []),
    );

    let templateResult: TemplateResult;
    const componentCleanup = adaptSyncEffect(() => {
      templateResult = this.htmlFn();
      if (this.updateFlag !== "initialize") {
        this.setValue(templateResult);
      }
    });

    //store 2nd cleanup
    this.cleanups.push(componentCleanup);

    this.updateFlag = "updateProps";

    return templateResult!;
  }

  update(
    part: ChildPart,
    [Component, props]: [(props: any) => () => TemplateResult, any],
  ) {
    //initialize component for the first time or update props based on the state of `updateFlag`
    return this[this.updateFlag](props, part, Component);
  }

  protected reconnected() {
    this.updateFlag = "initialize";
  }

  render() {
    return this.htmlFn();
  }

  updateProps(props: any) {
    for (const prop in props) {
      this.props[prop] = props[prop];
    }

    return this.render();
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
