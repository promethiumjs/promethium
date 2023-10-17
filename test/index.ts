import { renderTemplateFn, h } from "promethium-js";
import App from "./src/App";
import "./index.css";
import { renderComponentNamesAsWrapperComments } from "promethium-js";
import { html } from "lit";

(import.meta as any).env.DEV
  ? renderComponentNamesAsWrapperComments(true)
  : renderComponentNamesAsWrapperComments(false);

renderTemplateFn(() => html`${h(App)}`, { renderContainer: "body" });
