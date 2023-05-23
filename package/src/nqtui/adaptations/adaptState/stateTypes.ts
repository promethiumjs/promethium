import { Effect } from "../adaptEffect/effectTypes";

export type State<T = any> = {
  syncSubscriptions: {
    one: Set<Effect>;
    two: Set<Effect>;
  };
  memoSubscriptions: {
    one: Set<Effect>;
    two: Set<Effect>;
  };
  asyncAndRenderSubscriptions: Set<Effect>;
  activeSubscriptions: "one" | "two";
  value: T;
};

export type Getter<T = any> = () => T;
export type Setter<T = any> = (nextValue: T) => void;
