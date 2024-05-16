import { renderTemplateFn, h } from "promethium-js";
import App from "./src/App";
import "./index.css";
import { html } from "lit";

// TODO: check the implementation of this function (most especially its return value)
renderTemplateFn(() => html`${h(App)}`, { renderContainer: "body" });
