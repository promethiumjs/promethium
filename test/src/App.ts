import { html, h } from "promethium-js";
import Home from "./Home";
import About from "./About";
import { adaptParticle } from "@/entities";
import { Link, Switch, paths } from "@/router";

const App = () => {
  const [count, setCount] = adaptParticle("count");

  return () =>
    html`<div>Hello Promethium</div>
      ${h(Link, { to: paths.Home, text: "Home" })}
      ${h(Link, { to: paths.About, text: "About" })}
      ${h(Switch, {
        routes: [
          [paths.Home, Home()],
          [paths.About, About()],
        ],
        default: Home(),
      })}
      <button @click=${() => setCount(count() + 1)}>${count()}</button> `;
};

export default App;
