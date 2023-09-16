import { h, unify } from "promethium-js";
import { html } from "lit-html";
import Home from "./Home";
import About from "./About";
import { particleEntity } from "@/entities";
import { Link, Switch, paths } from "@/router";

export const count = unify(particleEntity.adaptParticle("count"));

const App = () => {
  return () => {
    console.log("App!");

    return html`<div>Hello Promethium</div>
      ${h(Link, { to: paths.Home, text: "Home" })}
      ${h(Link, { to: paths.About, text: "About" })}
      ${h(Switch, {
        routes: [
          [paths.Home, () => html`${h(Home)}`],
          [paths.About, () => html`${h(About)}`],
        ],
        default: () => html`${h(Home)}`,
      })}
      <button @click=${() => count((count) => count + 1)}>${count()}</button> `;
  };
};

export default App;
