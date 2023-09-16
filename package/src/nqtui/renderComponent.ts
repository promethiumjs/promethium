import { render, TemplateResult, RootPart, RenderOptions } from "lit-html";

export type Component<T = null> = T extends null
  ? (props?: null) => () => TemplateResult
  : (props: T) => () => TemplateResult;

export function renderComponent(
  RootTemplateResult: TemplateResult,
  props: {
    renderContainer: string | HTMLElement | DocumentFragment;
    renderOptions?: RenderOptions;
  }
): () => RootPart {
  //check whether or not "renderContainer" is a string and handle it
  //accordingly.
  if (
    typeof props.renderContainer === "string" ||
    props.renderContainer instanceof String
  ) {
    props.renderContainer = document.querySelector(
      props.renderContainer as any
    );
  }

  const renderComponent = () => {
    return render(
      RootTemplateResult,
      props.renderContainer as HTMLElement | DocumentFragment,
      props.renderOptions
    );
  };
  renderComponent();

  //return "renderComponent" function to allow re-rendering of whole root
  //component tree.
  return renderComponent;
}
