import { Component, h } from "../nqtui";

// TODO: implement fragment
const Fragment = Symbol.for("promethium-js/jsx-runtime/fragment");

const JSXElement = Symbol.for("JSXElement");

function jsx<T>(
  intrinsicOrValueBasedElement: Component<T> | typeof Fragment,
  props: T & { children: any }
) {
  if (intrinsicOrValueBasedElement === Fragment) {
    return props.children;
  }

  return h(intrinsicOrValueBasedElement, props as any);
}

type PrepareForLitConsumption<Type, Prefix extends string = ""> = {
  [Property in keyof Type as `${Prefix}${string & Property}`]+?: Type[Property];
} & {
  [attributeOrProperty: string]: any;
};

type ConvertToIntrinsicElements<Type> = {
  [Property in keyof Type]: PrepareForLitConsumption<Type[Property]>;
} & {
  [Property in keyof Type]: PrepareForLitConsumption<Type[Property], "bool:">;
} & {
  [Property in keyof Type]: PrepareForLitConsumption<Type[Property], "prop:">;
} & {
  [Property in keyof Type]: PrepareForLitConsumption<Type[Property], "attr:">;
} & {
  [Property in keyof Type]: PrepareForLitConsumption<Type[Property], "on:">;
} & {
  [Property in keyof Type]: PrepareForLitConsumption<Type[Property], "dir:">;
};
//  & {
//   [elemName: string]: any;
// };

// TODO:don't forget svg tags

declare namespace JSX {
  interface IntrinsicElements
    extends ConvertToIntrinsicElements<HTMLElementTagNameMap> {}
  interface ElementAttributesProperty {
    props: any;
  }

  interface ElementChildrenAttribute {
    children: any;
  }

  type Element = ReturnType<Component> | typeof JSXElement | null;
}

export { jsx, jsx as jsxs, jsx as jsxDEV, JSX, Fragment };
