import { unify } from "promethium-js";
import { html } from "lit";
import Home from "./Home";
import About from "./About";
import { particleEntity } from "@/entities";
import { Link, Switch, paths } from "@/router";

export const count = unify(particleEntity.adaptParticle("count"));

const App = () => {
  return () => {
    console.log("App!");

    return html`<div>Hello Promethium</div>
      ${(
        <>
          <Link to={paths.Home} text="Home"></Link>
          <Link to={paths.About} text="About"></Link>
          <Switch
            routes={[
              [paths.Home, () => <Home />],
              [paths.About, () => <About />],
            ]}
            default={() => <Home />}
          ></Switch>
        </>
      )}
      <button @click=${() => count((count) => count + 1)}>${count()}</button> `;
  };
};

export default App;
