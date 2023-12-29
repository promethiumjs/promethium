import { renderTemplateFn, h } from "promethium-js";
import App from "./src/App";
import "./index.css";
import { html } from "lit";

renderTemplateFn(() => html`${h(App)}`, { renderContainer: "body" });
