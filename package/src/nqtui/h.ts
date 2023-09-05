import {
  AsyncDirective,
  directive,
  DirectiveResult,
  PartInfo,
} from "lit-html/async-directive.js";
import { ChildPart, noChange, TemplateResult } from "lit-html";
import { Component } from "./render";
import adaptSyncEffect from "./adaptations/adaptEffect/adaptSyncEffect";

export const renderComponentNamesAsWrapperComments = (() => {
  let renderComponentNamesAsWrapperComments = false;
  return (newrenderComponentNamesAsWrapperComments?: boolean) => {
    if (newrenderComponentNamesAsWrapperComments) {
      renderComponentNamesAsWrapperComments =
        newrenderComponentNamesAsWrapperComments;
    } else {
      return renderComponentNamesAsWrapperComments;
    }
  };
})();

class $ extends AsyncDirective {
  updateFlag: "initialize" | "updateProps";
  cleanups: (() => void)[];
  props: any;

  constructor(partInfo: PartInfo) {
    super(partInfo);

    //boolean flag to enable initialization of the component in the update method.
    this.updateFlag = "initialize";
    //initialize cleanups for component. this includes:
    //1. general component cleanup for all its effects and memos
    //2. cleanup of the effect created from the function (that returns a template result) the component returns
    this.cleanups = [];
  }

  protected disconnected() {
    this.cleanups.forEach((cleanup) => cleanup());
  }

  //first time initialization of component
  initialize(
    props: any,
    part: ChildPart,
    Component: (props: any) => () => TemplateResult
  ) {
    this.props = props;

    return this.initializeComponent(Component, part, this.props);
  }

  initializeComponent(
    Component: (props: any) => () => TemplateResult,
    part: ChildPart,
    props: any
  ) {
    //store the function (that returns a template result) the component returns in `htmlFn` for later use
    let htmlFn: () => TemplateResult;
    //initialize component effects and memos and store the 1st cleanup
    this.cleanups.push(
      adaptSyncEffect(() => {
        htmlFn = Component(props);
      }, [])
    );

    let templateResult: TemplateResult;
    const componentCleanup = adaptSyncEffect(() => {
      templateResult = htmlFn();
      if (this.updateFlag !== "initialize") {
        this.setValue(templateResult);
      }
    });

    //store 2nd cleanup
    this.cleanups.push(componentCleanup);

    // conditionally render component name as comments
    if (renderComponentNamesAsWrapperComments()) {
      console.log(part);

      const componentNameComment = document.createComment(Component.name);
      const startNode = part.startNode;
      startNode?.parentNode?.insertBefore(
        componentNameComment.cloneNode(),
        startNode
      );
      const endNode = part.endNode;
      endNode?.parentNode?.insertBefore(
        componentNameComment,
        endNode.nextSibling
      );
    }

    this.updateFlag = "updateProps";

    return templateResult!;
  }

  update(
    part: ChildPart,
    [Component, props]: [(props: any) => () => TemplateResult, any]
  ) {
    //initialize component for the first time or update props based on the state of `updateFlag`
    return this[this.updateFlag](props, part, Component);
  }

  protected reconnected() {
    this.updateFlag = "initialize";
  }

  render() {
    return noChange;
  }

  updateProps(props: any) {
    for (const prop in props) {
      this.props[prop] = props[prop];
    }

    return noChange;
  }
}

declare function hFn(
  Component: () => () => TemplateResult,
  props?: null
): DirectiveResult;

declare function hFn<Type>(
  Component: Component<Type>,
  props: Type
): DirectiveResult;

const h: typeof hFn = directive($);

export default h;
