import type { Component } from "./renderComponent";
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
import { renderComponent } from "./renderComponent";
import h, { renderComponentNamesAsWrapperComments } from "./h";
import { adaptState } from "./adaptations/adaptState/adaptState";
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
  renderComponent,
  h,
  renderComponentNamesAsWrapperComments,
  adaptState,
  unify,
  getGetter,
  getSetter,
  getValue,
  adaptEffect,
  adaptRenderEffect,
  adaptSyncEffect,
  adaptMemo,
};
