import { directive, Directive, DirectiveParameters } from "lit/directive.js";
import { CSSResult, ElementPart, nothing, unsafeCSS } from "lit";

const scopeTextStatic = "promethium-js-lit-directives-style-scope-text";

const scopeText = `${scopeTextStatic}-${Date.now()}-${Math.random()
  .toString(36)
  .substring(2)}-${scopeTextStatic}`;

const scope = unsafeCSS(scopeText);

const scopeRegex = new RegExp(scopeText, "g");

class StyleHolder {
  private directiveInstances: Set<InjectDirective> = new Set();
  private styleTagMap: WeakMap<Document, HTMLStyleElement> = new WeakMap();
  private cssText: string;
  public scopeClass: string;

  constructor(cssResult: CSSResult) {
    this.scopeClass = `class-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}`;
    this.cssText = cssResult.cssText.replace(scopeRegex, `.${this.scopeClass}`);
  }

  addStylesDirective(injectDirective: InjectDirective) {
    this.directiveInstances.add(injectDirective);
    const elementRoot = injectDirective.element?.getRootNode();
    if (elementRoot instanceof ShadowRoot) {
      throw new Error(
        "Shadow roots are not supported! If you're making a custom element using Lit, please use the static styles property instead.",
      );
    }
    if (elementRoot instanceof Document) {
      if (this.styleTagMap.get(elementRoot) === undefined) {
        const styleTag = elementRoot.createElement("style");
        const nonce = (globalThis as any)["litNonce"];
        if (nonce !== undefined) {
          styleTag.setAttribute("nonce", nonce);
        }
        styleTag.textContent = this.cssText;
        elementRoot.head.appendChild(styleTag);
        this.styleTagMap.set(elementRoot, styleTag);
      }
    }
  }

  removeStylesDirective(injectDirective: InjectDirective) {
    this.directiveInstances.delete(injectDirective);
    if (this.directiveInstances.size === 0) {
      const elementRoot = injectDirective.element?.getRootNode();
      if (elementRoot instanceof Document) {
        const styleTag = this.styleTagMap.get(elementRoot);
        if (styleTag) {
          elementRoot.head.removeChild(styleTag);
          this.styleTagMap.delete(elementRoot);
        }
      }
    }
  }
}

const styleHolderCache = new WeakMap<CSSResult, StyleHolder>();

// TODO: only allow directive use in the element directive position
class InjectDirective extends Directive {
  private styleHolder?: StyleHolder;
  element?: HTMLElement;

  render(_cssResult: CSSResult | null) {
    return nothing;
  }

  injectIntoStyleHolder(styleHolder: StyleHolder) {
    this.styleHolder = styleHolder;
    this.styleHolder.addStylesDirective(this);
    if (this.element) {
      this.element.classList.add(this.styleHolder.scopeClass);
    }
  }

  ejectFromCurrentStyleHolder() {
    if (this.styleHolder) {
      if (this.element) {
        this.element.classList.remove(this.styleHolder.scopeClass);
      }
      this.styleHolder.removeStylesDirective(this);
    }
  }

  update(part: ElementPart, [cssResult]: DirectiveParameters<this>) {
    this.element = part.element as HTMLElement;
    if (!cssResult) {
      this.ejectFromCurrentStyleHolder();

      return nothing;
    }
    queueMicrotask(() => {
      let styleHolder = styleHolderCache.get(cssResult);
      if (styleHolder === undefined) {
        styleHolder = new StyleHolder(cssResult);
        styleHolderCache.set(cssResult, styleHolder);
      }
      if (styleHolder !== this.styleHolder) {
        this.ejectFromCurrentStyleHolder();
        this.injectIntoStyleHolder(styleHolder);
      }
    });

    return nothing;
  }
}

const inject = directive(InjectDirective);

export const styles = { scope, inject };
