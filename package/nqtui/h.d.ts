import { DirectiveResult } from "lit/async-directive.js";
import { TemplateResult } from "lit";
import { Component } from "./renderTemplateFn";
export declare const renderComponentNamesAsWrapperComments: (newrenderComponentNamesAsWrapperComments?: boolean) => boolean | undefined;
declare function hFn(Component: () => () => TemplateResult, props?: null): DirectiveResult;
declare function hFn<Type>(Component: Component<Type>, props: Type): DirectiveResult;
declare const h: typeof hFn;
export default h;
//# sourceMappingURL=h.d.ts.map