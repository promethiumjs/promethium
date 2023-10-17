import { Component } from "../nqtui";
import { TemplateResult } from "lit";
import type { Getter, Setter } from "../nqtui/adaptations/adaptState/stateTypes";
type PathsObject = {
    [key: string]: string;
};
type Paths = PathsObject;
export default class Router<P extends Paths> {
    paths: P;
    currentPath: Getter<string>;
    setCurrentPath: Setter<string>;
    constructor(paths: P);
    Link: Component<{
        to: P[keyof P];
        content?: TemplateResult | string | number;
        text?: string | number;
        class?: (isActive: boolean) => string;
        style?: (isActive: boolean) => string;
    }>;
    navigate(urlOrDelta: string | number): void;
    route(): void;
    Switch: Component<{
        routes: Array<[P[keyof P], () => TemplateResult]>;
        default?: () => TemplateResult;
    }>;
    setTitle(title: string): void;
}
export {};
//# sourceMappingURL=Router.d.ts.map