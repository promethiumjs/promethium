import { html } from "promethium-js";
import { count, showTwo } from "./App";

const Two = () => {
  return () => {
    console.log("two changed");

    return html`<div class=${showTwo() ? "" : "hidden"}>
      This is ${count()} Two!!!!!
    </div>`;
  };
};

export default Two;
