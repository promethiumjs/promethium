import { renderComponent, h } from "promethium-js";
import App from "./src/App";
import "./index.css";
import { renderComponentNamesAsWrapperComments } from "promethium-js";
import { html } from "lit-html";

(import.meta as any).env.DEV
  ? renderComponentNamesAsWrapperComments(true)
  : renderComponentNamesAsWrapperComments(false);

renderComponent(html`${h(App)}`, { renderContainer: "body" });
