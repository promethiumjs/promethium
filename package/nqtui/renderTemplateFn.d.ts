import { TemplateResult, RootPart, RenderOptions } from "lit";
export type Component<T = null> = T extends null ? (props?: null) => () => TemplateResult : (props: T) => () => TemplateResult;
export declare function renderTemplateFn(RootTemplateResult: () => TemplateResult, props: {
    renderContainer: string | HTMLElement | DocumentFragment;
    renderOptions?: RenderOptions;
}): () => RootPart;
//# sourceMappingURL=renderTemplateFn.d.ts.map