import { h, html } from "promethium-js";
import Couch from "./Couch";

const Hall = (props: { num: () => number }) => {
  return () => {
    console.log("Hall!", props.num());

    return html`${props.num()} ${h(Couch)} `;
  };
};

export default Hall;
