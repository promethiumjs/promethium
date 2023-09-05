import { render } from "promethium-js";
import App from "./src/App";
import "./index.css";
import { renderComponentNamesAsWrapperComments } from "promethium-js";

(import.meta as any).env.DEV
  ? renderComponentNamesAsWrapperComments(true)
  : renderComponentNamesAsWrapperComments(false);

render(App, { renderContainer: "body" });
