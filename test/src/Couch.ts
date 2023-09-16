import { html } from "lit-html";
import { count } from "./App";

const Couch = () => {
  return () => {
    console.log("Couch!");
    console.log(count());

    return html`<div>This is the couch!</div>`;
  };
};

export default Couch;
