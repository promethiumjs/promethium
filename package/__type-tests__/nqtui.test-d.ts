import { adaptState } from "../src/nqtui/adaptations/adaptState/adaptState";
import { expectTypeOf } from "expect-type";

// TODO: revisit using vitest for type testing
const [count] = adaptState(0);
expectTypeOf(count()).toEqualTypeOf<number>();
