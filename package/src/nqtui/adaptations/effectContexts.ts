import { InternalEffectObject } from "./adaptEffect/effectTypes";

//stack to track effects that are currently being tracked by state and memos
export const effectContexts: InternalEffectObject[] = [];
