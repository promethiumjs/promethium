import { DirectiveResult } from "lit/async-directive.js";
import { type Component, h } from "../directives/h";
import { html } from "lit";
import { noChange, nothing } from "lit";

// TODO: revise and refine attribute types
type IntrinsicElementsSVGAttributes =
  | "accent-height"
  | "accumulate"
  | "additive"
  | "alignment-baseline"
  | "alphabetic"
  | "amplitude"
  | "arabic-form"
  | "ascent"
  | "attributeName"
  | "attributeType"
  | "azimuth"
  | "baseFrequency"
  | "baseline-shift"
  | "baseProfile"
  | "bbox"
  | "begin"
  | "bias"
  | "by"
  | "calcMode"
  | "cap-height"
  | "class"
  | "clip"
  | "clipPathUnits"
  | "clip-path"
  | "clip-rule"
  | "color"
  | "color-interpolation"
  | "color-interpolation-filters"
  | "color-rendering"
  | "crossorigin"
  | "cursor"
  | "cx"
  | "cy"
  | "d"
  | `data-${string}`
  | "decelerate"
  | "decoding"
  | "descent"
  | "diffuseConstant"
  | "direction"
  | "display"
  | "divisor"
  | "dominant-baseline"
  | "dur"
  | "dx"
  | "dy"
  | "edgeMode"
  | "elevation"
  | "end"
  | "exponent"
  | "fill"
  | "fill-opacity"
  | "fill-rule"
  | "filter"
  | "filterUnits"
  | "flood-color"
  | "flood-opacity"
  | "font-family"
  | "font-size"
  | "font-size-adjust"
  | "font-stretch"
  | "font-style"
  | "font-variant"
  | "font-weight"
  | "format"
  | "from"
  | "fr"
  | "fx"
  | "g1"
  | "fy"
  | "g2"
  | "glyph-name"
  | "glyph-orientation-horizontal"
  | "glyph-orientation-vertical"
  | "glyphRef"
  | "gradientTransform"
  | "gradientUnits"
  | "hanging"
  | "height"
  | "href"
  | "hreflang"
  | "horiz-adv-x"
  | "horiz-origin-x"
  | "horiz-origin-y"
  | "id"
  | "ideographic"
  | "image-rendering"
  | "in"
  | "in2"
  | "intercept"
  | "k"
  | "k1"
  | "k2"
  | "k3"
  | "k4"
  | "kernelMatrix"
  | "kernelUnitLength"
  | "keyPoints"
  | "keySplines"
  | "keyTimes"
  | "lang"
  | "lengthAdjust"
  | "letter-spacing"
  | "lighting-color"
  | "limitingConeAngle"
  | "local"
  | "marker-end"
  | "marker-mid"
  | "marker-start"
  | "markerHeight"
  | "markerUnits"
  | "markerWidth"
  | "mask"
  | "maskUnits"
  | "maskContentUnits"
  | "mathematical"
  | "max"
  | "media"
  | "method"
  | "min"
  | "mode"
  | "name"
  | "numOctaves"
  | "offset"
  | "opacity"
  | "operator"
  | "order"
  | "orient"
  | "orientation"
  | "origin"
  | "overflow"
  | "overline-position"
  | "overline-thickness"
  | "panose-1"
  | "paint-order"
  | "path"
  | "pathLength"
  | "patternContentUnits"
  | "patternTransform"
  | "patternUnits"
  | "ping"
  | "pointer-events"
  | "points"
  | "pointsAtX"
  | "pointsAtY"
  | "pointsAtZ"
  | "preserveAlpha"
  | "preserveAspectRatio"
  | "primitiveUnits"
  | "r"
  | "radius"
  | "referrerPolicy"
  | "refX"
  | "refY"
  | "rel"
  | "rendering-intent"
  | "repeatCount"
  | "repeatDur"
  | "requiredExtensions"
  | "requiredFeatures"
  | "restart"
  | "result"
  | "rotate"
  | "rx"
  | "ry"
  | "scale"
  | "seed"
  | "shape-rendering"
  | "side"
  | "slope"
  | "spacing"
  | "specularConstant"
  | "specularExponent"
  | "speed"
  | "spreadMethod"
  | "startOffset"
  | "stdDeviation"
  | "stemh"
  | "stemv"
  | "stitchTiles"
  | "stop-color"
  | "stop-opacity"
  | "strikethrough-position"
  | "strikethrough-thickness"
  | "string"
  | "stroke"
  | "stroke-dasharray"
  | "stroke-dashoffset"
  | "stroke-linecap"
  | "stroke-linejoin"
  | "stroke-miterlimit"
  | "stroke-opacity"
  | "stroke-width"
  | "style"
  | "surfaceScale"
  | "systemLanguage"
  | "tabindex"
  | "tableValues"
  | "target"
  | "targetX"
  | "targetY"
  | "text-anchor"
  | "text-decoration"
  | "text-rendering"
  | "textLength"
  | "to"
  | "transform"
  | "transform-origin"
  | "type"
  | "U"
  | "u1"
  | "u2"
  | "underline-position"
  | "underline-thickness"
  | "unicode"
  | "unicode-bidi"
  | "unicode-range"
  | "units-per-em"
  | "v-alphabetic"
  | "v-hanging"
  | "v-ideographic"
  | "v-mathematical"
  | "values"
  | "vector-effect"
  | "version"
  | "vert-adv-y"
  | "vert-origin-x"
  | "vert-origin-y"
  | "viewBox"
  | "visibility"
  | "width"
  | "widths"
  | "word-spacing"
  | "writing-mode"
  | "x"
  | "x-height"
  | "x1"
  | "x2"
  | "xChannelSelector"
  | "xlink:actuate"
  | "xlink:arcrole"
  | "xlink:hrefDeprecated"
  | "xlink:role"
  | "xlink:show"
  | "xlink:title"
  | "xlink:type"
  | "xml:lang"
  | "xml:space"
  | "y"
  | "y1"
  | "y2"
  | "yChannelSelector"
  | "z"
  | "zoomAndPan";

type IntrinsicElementsHTMLAttributes =
  | "accept"
  | "accept-charset"
  | "accesskey"
  | "action"
  | "allow"
  | "alt"
  | "as"
  | "async"
  | "autocapitalize"
  | "autocomplete"
  | "autoplay"
  | "capture"
  | "charset"
  | "checked"
  | "cite"
  | "class"
  | "cols"
  | "colspan"
  | "content"
  | "contenteditable"
  | "controls"
  | "coords"
  | "crossorigin"
  | "csp"
  | "data"
  | `data-${string}`
  | "datetime"
  | "decoding"
  | "default"
  | "defer"
  | "dir"
  | "dirname"
  | "disabled"
  | "download"
  | "draggable"
  | "enctype"
  | "enterkeyhint"
  | "for"
  | "form"
  | "formaction"
  | "formenctype"
  | "formmethod"
  | "formnovalidate"
  | "formtarget"
  | "headers"
  | "hidden"
  | "high"
  | "href"
  | "hreflang"
  | "http-equiv"
  | "id"
  | "integrity"
  | "ismap"
  | "itemprop"
  | "kind"
  | "label"
  | "lang"
  | "language"
  | "list"
  | "loop"
  | "low"
  | "max"
  | "maxlength"
  | "minlength"
  | "media"
  | "method"
  | "min"
  | "multiple"
  | "muted"
  | "name"
  | "novalidate"
  | "open"
  | "optimum"
  | "pattern"
  | "ping"
  | "placeholder"
  | "playsinline"
  | "poster"
  | "preload"
  | "readonly"
  | "referrerpolicy"
  | "rel"
  | "required"
  | "reversed"
  | "role"
  | "rows"
  | "rowspan"
  | "sandbox"
  | "scope"
  | "scoped"
  | "selected"
  | "shape"
  | "size"
  | "sizes"
  | "slot"
  | "span"
  | "spellcheck"
  | "src"
  | "srcdoc"
  | "srclang"
  | "srcset"
  | "start"
  | "step"
  | "style"
  | "summary"
  | "tabindex"
  | "target"
  | "title"
  | "translate"
  | "Text"
  | "type"
  | "usemap"
  | "value"
  | "width"
  | "wrap";

type IntrinsicElementsMathMLAttributes =
  | "accent"
  | "accent"
  | "accentunder"
  | "actiontype"
  | "align"
  | "background"
  | "background-color"
  | "close"
  | "color"
  | "color"
  | "columnalign"
  | "columnlines"
  | "columnspacing"
  | "columnspan"
  | "denomalign"
  | "depth"
  | "dir"
  | "ltr"
  | "rtl"
  | "display"
  | "block"
  | "inline"
  | "displaystyle"
  | "normal"
  | "compact"
  | "fence"
  | "fontfamily"
  | "font-family"
  | "fontsize"
  | "font-size"
  | "fontstyle"
  | "font-style"
  | "fontweight"
  | "font-weight"
  | "frame"
  | "none"
  | "solid"
  | "dashed"
  | "framespacing"
  | "frame"
  | "height"
  | "href"
  | "id"
  | "linethickness"
  | "lspace"
  | "lspace"
  | "lquote"
  | "&quot;"
  | "mathbackground"
  | "mathcolor"
  | "mathsize"
  | "font-size"
  | "mathvariant"
  | "maxsize"
  | "minsize"
  | "movablelimits"
  | "compact"
  | "notation"
  | "numalign"
  | "open"
  | "rowalign"
  | "rowlines"
  | "rowspacing"
  | "rowspan"
  | "rspace"
  | "rquote"
  | "&quot;"
  | "scriptlevel"
  | "scriptminsize"
  | "scriptlevel"
  | "scriptsizemultiplier"
  | "scriptlevel"
  | "selection"
  | "actiontype"
  | "separator"
  | "separators"
  | "stretchy"
  | "subscriptshift"
  | "superscriptshift"
  | "symmetric"
  | "voffset"
  | "width"
  | "xmlns";

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

type PrefixifyWithoutChildrenConflict<Tag, Prefix extends string> =
  | {
      [TagProp in keyof Tag as `${Prefix}${string &
        TagProp}`]+?: TagProp extends "children"
        ? unknown
        : Tag[TagProp] | typeof nothing | typeof noChange | undefined | null;
    } & { children?: unknown };

type ConvertToIntrinsicElements<TagNameMap, Attributes extends string> = {
  [TagName in keyof TagNameMap]: Partial<Record<Attributes, string>>;
} & {
  [TagName in keyof TagNameMap]: PrefixifyWithoutChildrenConflict<
    TagNameMap[TagName],
    ""
  >;
} & {
  [TagName in keyof TagNameMap]: Prefixify<TagNameMap[TagName], "prop:">;
} & {
  [TagName in keyof TagNameMap]: Prefixify<Record<string, unknown>, "$prop:">;
} & {
  [TagName in keyof TagNameMap]: Prefixify<Record<Attributes, string>, "attr:">;
} & {
  [TagName in keyof TagNameMap]: Prefixify<
    TagNameMap[TagName],
    "attr:",
    string
  >;
} & {
  [TagName in keyof TagNameMap]: Prefixify<Record<string, unknown>, "$attr:">;
} & {
  [TagName in keyof TagNameMap]: Prefixify<
    Record<Attributes, boolean>,
    "bool:"
  >;
} & {
  [TagName in keyof TagNameMap]: Prefixify<
    TagNameMap[TagName],
    "bool:",
    boolean
  >;
} & {
  [TagName in keyof TagNameMap]: Prefixify<
    Record<string, boolean>,
    "$bool:",
    boolean
  >;
} & {
  [TagName in keyof TagNameMap]: Prefixify<
    IntrinsicElementsEventListenerOrEventListenerObjectMap,
    "on:"
  >;
} & {
  [TagName in keyof TagNameMap]: Prefixify<
    Record<string, (e: Event) => void>,
    "$on:"
  >;
} & {
  [TagName in keyof TagNameMap]: Prefixify<
    Record<string, DirectiveResult>,
    "use:"
  >;
};

declare namespace JSX {
  interface IntrinsicElements
    extends ConvertToIntrinsicElements<
        HTMLElementTagNameMap,
        IntrinsicElementsHTMLAttributes
      >,
      ConvertToIntrinsicElements<
        Omit<SVGElementTagNameMap, "a" | "script" | "style" | "title">,
        IntrinsicElementsSVGAttributes
      >,
      ConvertToIntrinsicElements<
        MathMLElementTagNameMap,
        IntrinsicElementsMathMLAttributes
      > {}
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
  props: T & { children?: unknown },
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
