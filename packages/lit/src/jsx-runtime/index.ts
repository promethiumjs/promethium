import { type Component, h } from "../directives/h.js";
import { html } from "lit";
import { noChange, nothing } from "lit";

interface IntrinsicElementsEventListener<E extends Event = Event> {
  (evt: E): void;
}

interface IntrinsicElementsEventListenerObject<E extends Event = Event>
  extends AddEventListenerOptions {
  handleEvent(object: E): void;
}

interface IntrinsicElementsEventMap
  extends HTMLElementEventMap,
    HTMLBodyElementEventMap,
    HTMLMediaElementEventMap,
    HTMLVideoElementEventMap {}

type IntrinsicElementsEventListenerOrEventListenerObjectMap = {
  [Property in keyof IntrinsicElementsEventMap]:
    | IntrinsicElementsEventListener<IntrinsicElementsEventMap[Property]>
    | IntrinsicElementsEventListenerObject<IntrinsicElementsEventMap[Property]>;
};

type PropType = Exclude<
  `${"" | "$"}${"prop" | "attr" | "on" | "bool" | "use"}`,
  "$use"
>;
type BasicPropType = Exclude<PropType, `$${string}`>;

type Prefixify<Tag, Prefix extends string, filter = any> =
  | {
      [TagProp in keyof Tag as `${Prefix}${string &
        TagProp}`]+?: Tag[TagProp] extends filter
        ? Tag[TagProp] | typeof nothing | typeof noChange | undefined | null
        : never;
    } & { children?: unknown };

type ConvertToIntrinsicElements<TagNameMap> = {
  [TagName in keyof TagNameMap]: Prefixify<TagNameMap[TagName], "prop:">;
} & {
  [TagName in keyof TagNameMap]: Prefixify<Record<string, unknown>, "$prop:">;
} & {
  [TagName in keyof TagNameMap]: Prefixify<Record<string, string>, "attr:">;
} & {
  [TagName in keyof TagNameMap]: Prefixify<Record<string, unknown>, "$attr:">;
} & {
  [TagName in keyof TagNameMap]: Prefixify<Record<string, boolean>, "bool:">;
} & {
  [TagName in keyof TagNameMap]: Prefixify<Record<string, unknown>, "$bool:">;
} & {
  [TagName in keyof TagNameMap]: Prefixify<
    IntrinsicElementsEventListenerOrEventListenerObjectMap,
    "on:"
  >;
} & {
  [TagName in keyof TagNameMap]: Prefixify<Record<string, unknown>, "$on:">;
} & {
  [TagName in keyof TagNameMap]: Prefixify<Record<string, unknown>, "use:">;
};

declare namespace JSX {
  interface IntrinsicElements
    extends ConvertToIntrinsicElements<HTMLElementTagNameMap>,
      ConvertToIntrinsicElements<
        Omit<SVGElementTagNameMap, "a" | "script" | "style" | "title">
      >,
      ConvertToIntrinsicElements<MathMLElementTagNameMap> {}
  interface ElementAttributesProperty {
    props: unknown;
  }

  interface ElementChildrenAttribute {
    children: unknown;
  }

  type Element = ReturnType<Component> | null;
}

const Fragment = Symbol("promethium-js-lit-jsx-runtime-fragment");

const propPrefixes: Record<BasicPropType, "?" | "." | "@" | ""> = {
  prop: ".",
  attr: "",
  use: "",
  on: "@",
  bool: "?",
};

function insertPropOrElementDirective(options: {
  propType: BasicPropType;
  propName: string;
  propValue: unknown;
  propIndex: number;
  stringsArray: string[];
  valuesArray: unknown[];
}) {
  const propPrefix = propPrefixes[options.propType];
  const propStatic = ` ${propPrefix}${options.propName}=`;
  // so that entries in both strings and values arrays a pushed in the right places for consumption by lit
  if (options.propType !== "use") {
    if (options.propIndex === 0) {
      options.stringsArray[0] += propStatic;
    } else {
      options.stringsArray.push(propStatic);
    }
  } else {
    if (options.propIndex === 0) {
      options.stringsArray[0] += " ";
    } else {
      options.stringsArray.push(" ");
    }
  }
  options.valuesArray.push(options.propValue);
}

const stringsCache = new Map<string, TemplateStringsArray>();

function jsx<T>(
  intrinsicOrValueBasedElement:
    | Component<T>
    | typeof Fragment
    | keyof JSX.IntrinsicElements,
  props: T & { children?: unknown }
) {
  if (intrinsicOrValueBasedElement === Fragment) {
    return props.children;
  }
  if (typeof intrinsicOrValueBasedElement === "function") {
    return h(intrinsicOrValueBasedElement, props as any);
  }

  if (typeof intrinsicOrValueBasedElement === "string") {
    const strings = [`<${intrinsicOrValueBasedElement}`] as string[] & {
      raw: unknown[];
    };
    const values = [] as unknown[];

    Object.keys(props)
      // sort to always produce the same strings array for the same element and set of props, even if they're in a different sequence
      .sort()
      .filter((propDescriptor) => propDescriptor !== "children")
      .forEach((propDescriptor, index) => {
        const propDescriptorSegments = propDescriptor.split(":");
        const propType = propDescriptorSegments.shift() as PropType;
        const propName = propDescriptorSegments.join(":");
        switch (propType) {
          case "prop":
          case "$prop":
            insertPropOrElementDirective({
              propType: "prop",
              propIndex: index,
              propName,
              propValue: (props as Record<string, unknown>)[propDescriptor],
              stringsArray: strings,
              valuesArray: values,
            });
            break;
          case "attr":
          case "$attr":
            insertPropOrElementDirective({
              propType: "attr",
              propIndex: index,
              propName,
              propValue: (props as Record<string, unknown>)[propDescriptor],
              stringsArray: strings,
              valuesArray: values,
            });
            break;
          case "on":
          case "$on":
            insertPropOrElementDirective({
              propType: "on",
              propIndex: index,
              propName,
              propValue: (props as Record<string, unknown>)[propDescriptor],
              stringsArray: strings,
              valuesArray: values,
            });
            break;
          case "bool":
          case "$bool":
            insertPropOrElementDirective({
              propType: "bool",
              propIndex: index,
              propName,
              propValue: (props as Record<string, unknown>)[propDescriptor],
              stringsArray: strings,
              valuesArray: values,
            });
            break;
          case "use":
            insertPropOrElementDirective({
              propType: "use",
              propIndex: index,
              propName,
              propValue: (props as Record<string, unknown>)[propDescriptor],
              stringsArray: strings,
              valuesArray: values,
            });
            break;
          default:
            insertPropOrElementDirective({
              // any prop with an unrecognized type is treated as an attribute
              propType: "attr",
              propIndex: index,
              // because this prop doesn't have a recognized type, we'll have to pass the whole prop descriptor as the prop name
              propName: propDescriptor,
              propValue: (props as Record<string, unknown>)[propDescriptor],
              stringsArray: strings,
              valuesArray: values,
            });
            break;
        }
      });

    // so that entries in both strings and values arrays a pushed in the right places for consumption by lit
    if (strings.length === values.length) {
      strings.push(">");
    } else {
      strings[strings.length - 1] += ">";
    }
    values.push(props.children);
    strings.push(`</${intrinsicOrValueBasedElement}>`);
    strings.raw = strings;
    const cacheKey = strings.join("$");
    const cachedStrings = stringsCache.get(cacheKey);
    if (cachedStrings === undefined) {
      stringsCache.set(cacheKey, strings as unknown as TemplateStringsArray);

      return html(strings as unknown as TemplateStringsArray, ...values);
    } else {
      return html(cachedStrings, ...values);
    }
  }
}

export { jsx, jsx as jsxs, jsx as jsxDEV, JSX, Fragment };
