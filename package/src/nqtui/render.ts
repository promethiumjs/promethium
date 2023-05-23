import {
  render as internalRender,
  html,
  TemplateResult,
  RootPart,
} from "lit-html";
import h from "./h";

export type Component<T = null> = T extends null
  ? (props?: null) => () => TemplateResult
  : (props: T) => () => TemplateResult;

export function render(
  Component: Component<{
    renderContainer: string | HTMLElement | DocumentFragment;
    renderOptions?: Object;
  }>,
  props: {
    renderContainer: string | HTMLElement | DocumentFragment;
    renderOptions?: Object;
  }
): () => RootPart {
  //check whether or not "renderContainer" is a string and handle it
  //accordingly.
  if (
    typeof props.renderContainer === "string" ||
    props.renderContainer instanceof String
  )
    props.renderContainer = document.querySelector(
      props.renderContainer as any
    );

  const renderComponent = () =>
    internalRender(
      html`${h(Component, props)}`,
      props.renderContainer as HTMLElement | DocumentFragment,
      props.renderOptions
    );

  //queue microtask to render the component to enable all extensions to run first.
  queueMicrotask(renderComponent);

  //return "renderComponent" function to allow re-rendering of whole root
  //component tree.
  return renderComponent;
}
