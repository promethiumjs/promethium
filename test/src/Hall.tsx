import Couch from "./Couch";
import { html } from "lit";

const Hall = (props: { num: () => number }) => {
  return () => {
    console.log("Hall!", props.num());

    return html`${props.num()} ${(<Couch num={props.num()} />)} `;
  };
};

export default Hall;
