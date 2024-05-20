import type { Component } from "./renderTemplateFn";
import type {
  Getter,
  Setter,
  State,
  UnifiedState,
} from "./adaptations/adaptState/stateTypes";
import type {
  EffectFn,
  EffectOptions,
  DepArray,
} from "./adaptations/adaptEffect/effectTypes";
import { renderTemplateFn } from "./renderTemplateFn";
import h from "./h";
import watch from "./watch";
import { adaptState } from "./adaptations/adaptState/adaptState";
import { imperativeUpdate } from "./adaptations/adaptState/set";
import {
  unify,
  getGetter,
  getSetter,
  getValue,
} from "./adaptations/adaptState/utils";
import adaptEffect from "./adaptations/adaptEffect/adaptEffect";
import adaptRenderEffect from "./adaptations/adaptEffect/adaptRenderEffect";
import adaptSyncEffect from "./adaptations/adaptEffect/adaptSyncEffect";
import adaptMemo from "./adaptations/adaptMemo/adaptMemo";

export {
  Component,
  Getter,
  Setter,
  State,
  UnifiedState,
  EffectFn,
  EffectOptions,
  DepArray,
  renderTemplateFn,
  h,
  watch,
  adaptState,
  imperativeUpdate,
  unify,
  getGetter,
  getSetter,
  getValue,
  adaptEffect,
  adaptRenderEffect,
  adaptSyncEffect,
  adaptMemo,
};
