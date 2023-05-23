import { html } from "promethium-js";
import { count, showOne } from "./App";

const One = () => {
  return () => {
    return html`<div class=${showOne() ? "" : "hidden"}>
      This is ${count()} One!!!!!
    </div>`;
  };
};

export default One;
