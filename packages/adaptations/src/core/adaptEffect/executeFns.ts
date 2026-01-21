import { implicitDependencyExecuteFn } from "./implicitDependencyExecuteFn.js";
import { dependencyArrayExecuteFn } from "./dependencyArrayExecuteFn.js";

export const executeFns = {
  implicit: implicitDependencyExecuteFn,
  depArray: dependencyArrayExecuteFn,
};
