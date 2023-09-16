import { TemplateResult, RootPart, RenderOptions } from "lit-html";
export declare type Component<T = null> = T extends null ? (props?: null) => () => TemplateResult : (props: T) => () => TemplateResult;
export declare function renderComponent(RootTemplateResult: TemplateResult, props: {
    renderContainer: string | HTMLElement | DocumentFragment;
    renderOptions?: RenderOptions;
}): () => RootPart;
//# sourceMappingURL=renderComponent.d.ts.map