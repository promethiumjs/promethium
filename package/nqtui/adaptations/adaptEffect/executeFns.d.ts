import implicitDependencyExecuteFn from "./implicitDependencyExecuteFn";
import { dependencyArrayExecuteFn } from "./dependencyArrayExecuteFn";
import { componentFnExecuteFn } from "./componentFnExecuteFn";
declare const executeFns: {
    implicit: typeof implicitDependencyExecuteFn;
    depArray: typeof dependencyArrayExecuteFn;
    componentFn: typeof componentFnExecuteFn;
};
export default executeFns;
//# sourceMappingURL=executeFns.d.ts.map