import { adaptState } from "../src/nqtui/adaptations/adaptState/adaptState.js";
import { expectTypeOf } from "expect-type";

const [count, setCount] = adaptState(0);
expectTypeOf(count()).toEqualTypeOf<string>();
