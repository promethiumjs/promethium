import { renderTemplateFn, h } from "promethium-js";
import App from "./src/App";
import "./index.css";
import { html } from "lit";

const re = renderTemplateFn(() => html`${h(App)}`, { renderContainer: "body" });

setTimeout(() => {
  console.log("yo");

  re();
}, 5000);
