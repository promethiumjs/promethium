import implicitDependencyExecuteFn from "./implicitDependencyExecuteFn";
import { dependencyArrayExecuteFn } from "./dependencyArrayExecuteFn";

const executeFns = {
  implicit: implicitDependencyExecuteFn,
  depArray: dependencyArrayExecuteFn,
};

export default executeFns;
