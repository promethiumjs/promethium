import { Component, h } from "../nqtui";

const Fragment = Symbol.for("promethium-js/jsx-runtime/fragment");

function jsx<T>(
  intrinsicOrValueBasedElement: Component<T> | typeof Fragment,
  props: T & { children: any },
) {
  if (intrinsicOrValueBasedElement === Fragment) {
    return props.children;
  }

  return h(intrinsicOrValueBasedElement, props as any);
}

declare namespace JSX {
  interface ElementAttributesProperty {
    props: any;
  }
  interface ElementChildrenAttribute {
    children: any;
  }
}

export { jsx, jsx as jsxs, jsx as jsxDEV, JSX, Fragment };
