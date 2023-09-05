import implicitDependencyExecuteFn from "./implicitDependencyExecuteFn";
import { dependencyArrayExecuteFn } from "./dependencyArrayExecuteFn";
declare const executeFns: {
    implicit: typeof implicitDependencyExecuteFn;
    depArray: typeof dependencyArrayExecuteFn;
};
export default executeFns;
//# sourceMappingURL=executeFns.d.ts.map