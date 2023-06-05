import {
  html,
  h,
  adaptMemo,
  adaptRenderEffect,
  adaptState,
} from "promethium-js";
import Home from "./Home";
import About from "./About";
import { Link, Switch, paths } from "./router";
import { adaptParticle } from "./entity";

const App = () => {
  const [count, setCount] = adaptParticle("count");
  const countPlusOne = adaptMemo((prev: number = 0) => {
    return count() + 1;
  });

  const [name, setName] = adaptState("Paul");

  const n = 4;

  adaptRenderEffect(
    (rt: number = 0, [count, name]: [number, string] = [0, "me"]) => {
      return () => {
        return 4;
      };
    },
    [count, name]
  );

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
      <button @click=${() => setCount(count() + 1)}>
        ${count()}, ${countPlusOne()}
      </button> `;
};

export default App;
