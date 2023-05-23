import implicitDependencyExecuteFn from "./implicitDependencyExecuteFn";
import { dependencyArrayExecuteFn } from "./dependencyArrayExecuteFn";
import { componentFnExecuteFn } from "./componentFnExecuteFn";

const executeFns = {
  implicit: implicitDependencyExecuteFn,
  depArray: dependencyArrayExecuteFn,
  componentFn: componentFnExecuteFn,
};

export default executeFns;
