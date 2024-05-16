import { h } from "promethium-js";
import Couch from "./Couch";
import { html } from "lit";

const Hall = (props: { num: () => number }) => {
  return () => {
    console.log("Hall!", props.num());

    return html`${props.num()} ${h(Couch, { num: props.num() })} `;
  };
};

export default Hall;
