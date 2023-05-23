import { html, adaptEffect } from "promethium-js";
import { Component } from "promethium-js";

const Todo: Component<{ text: string }> = (props) => {
  adaptEffect(() => {
    return () => console.log("news");
  });

  return () => html`<div>How are you doing?? ${props.text}</div>`;
};

export default Todo;
