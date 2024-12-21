import { adaptState } from "../src/core/adaptState/adaptState";
import { expectTypeOf } from "vitest";

// TODO: revisit using vitest for type testing
const [count] = adaptState(0);
expectTypeOf(count()).toEqualTypeOf<number>();
