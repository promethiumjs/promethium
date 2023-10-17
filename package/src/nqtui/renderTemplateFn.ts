import { render, TemplateResult, RootPart, RenderOptions } from "lit";

export type Component<T = null> = T extends null
  ? (props?: null) => () => TemplateResult
  : (props: T) => () => TemplateResult;

export function renderTemplateFn(
  RootTemplateResult: () => TemplateResult,
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

  const renderTemplateFn = () => {
    return render(
      RootTemplateResult(),
      props.renderContainer as HTMLElement | DocumentFragment,
      props.renderOptions
    );
  };
  renderTemplateFn();

  //return "renderTemplateFn" function to allow re-rendering of whole root
  //component tree.
  return renderTemplateFn;
}
