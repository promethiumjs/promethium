import { Component, h } from "../nqtui";

const Fragment = Symbol.for("promethium-js/jsx-runtime/fragment");

const JSXElement = Symbol.for("JSXElement");

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

  type Element = ReturnType<Component> | typeof JSXElement | null;
}

export { jsx, jsx as jsxs, jsx as jsxDEV, JSX, Fragment };
