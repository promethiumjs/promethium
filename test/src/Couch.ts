import { html } from "lit";
import { count } from "./App";

const Couch = (props: { num: number }) => {
  return () => {
    console.log("Couch!");
    console.log(count());
    console.log("num", props.num);

    return html`<div>This is the couch!</div>`;
  };
};

export default Couch;
