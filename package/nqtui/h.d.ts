import { DirectiveResult } from "lit-html/async-directive.js";
import { TemplateResult } from "lit-html";
import { Component } from "./render";
declare function hFunc(Component: () => () => TemplateResult, props?: null): DirectiveResult;
declare function hFunc<Type>(Component: Component<Type>, props: Type): DirectiveResult;
declare const h: typeof hFunc;
export default h;
//# sourceMappingURL=h.d.ts.map