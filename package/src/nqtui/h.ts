import {
  AsyncDirective,
  directive,
  DirectiveResult,
  PartInfo,
} from "lit-html/async-directive.js";
import queueRevertChangedToTrue from "./queueRevertChangedToTrue";
import adaptComponentFnEffect from "./adaptations/adaptEffect/adaptComponentFnEffect";
import adaptSyncEffect from "./adaptations/adaptEffect/adaptSyncEffect";
import { ChildPart, noChange, TemplateResult } from "lit-html";
import { Component } from "./render";

class $ extends AsyncDirective {
  updateFlag: "initialize" | "externalRender";
  cleanups: any[];
  ComponentDependencyUpdate: any;
  Component: () => TemplateResult;
  changed: boolean;
  props: any;

  constructor(partInfo: PartInfo) {
    super(partInfo);

    //boolean flag to enable initialization of the component in the update method.
    this.updateFlag = "initialize";
  }

  protected disconnected(): void {
    this.cleanups.forEach((cleanup) => cleanup());
  }

  //normal render process
  externalRender(props: any) {
    for (const prop in props) {
      this.props[prop] = props[prop];
    }

    return this.render();
  }

  //first time initialization of component
  initialize(
    props: any,
    part: ChildPart,
    Component: (props: any, parent: Node) => () => TemplateResult
  ) {
    this.props = props;

    return this.initializeComponent(Component, part.parentNode, this.props);
  }

  initializeComponent(
    Component: (props: any, parent: Node) => () => TemplateResult,
    parent: Node,
    props: any
  ) {
    //initialize cleanups for component. this includes:
    //1. general component cleanup for all its effects and memos
    //2. cleanup of the effect created from the function (that returns a template result) the component returns
    this.cleanups = [];

    //store the function (that returns a template result) the component returns in `htmlFn` for later us
    let htmlFn: () => TemplateResult;
    //initialize component effects and memos and store the cleanup (1st cleanup)
    this.cleanups.push(
      adaptSyncEffect(() => (htmlFn = Component(props, parent)), [])
    );

    const [
      ComponentCleanup,
      ComponentDependencyUpdate,
      [htmlTemplateResult],
    ]: any = adaptComponentFnEffect(
      (_, [htmlTemplateResult]: [TemplateResult]) => {
        this.setValue(htmlTemplateResult);
      },
      [htmlFn],
      { defer: true, isComponent: true }
    );

    //store 2nd cleanup
    this.cleanups.push(ComponentCleanup);
    //store reference to function used to update component return function dependencies and return template
    //result for rendering
    this.ComponentDependencyUpdate = ComponentDependencyUpdate;

    this.Component = () => {
      //check "changed" flag to prevent multiple redundant re-rendering of components.
      if (this.changed) {
        this.changed = false;
        queueRevertChangedToTrue(this);

        const [htmlTemplateResult] = this.ComponentDependencyUpdate?.();

        return htmlTemplateResult;
      } else {
        return noChange;
      }
    };

    //initialize "changed" flag as true.
    this.changed = true;
    //prevent re-initialization of component on subsequent renders after initialization.
    this.updateFlag = "externalRender";

    return htmlTemplateResult;
  }

  update(
    part: ChildPart,
    [Component, props]: [
      (props: any, parent: Node) => () => TemplateResult,
      any
    ]
  ) {
    //initialize component for the first time or go through normal rendering processes based on the state of `updateFlag`
    return this[this.updateFlag](props, part, Component);
  }

  protected reconnected(): void {
    this.updateFlag = "initialize";
  }

  render() {
    return this.Component();
  }
}

declare function hFunc(
  Component: () => () => TemplateResult,
  props?: null
): DirectiveResult;

declare function hFunc<Type>(
  Component: Component<Type>,
  props: Type
): DirectiveResult;

const h: typeof hFunc = directive($);

export default h;
