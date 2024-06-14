import { adaptState } from "promethium-js";
import { html } from "lit";
import Hall from "./Hall";

const Home = () => {
  const [num, setNum] = adaptState(0);
  return () => {
    console.log("Home!");

    return html`<div>This is my Home page!</div>
      ${(<Hall num={num} />)}
      <button @click=${() => setNum(num() + 1)}>Let's see</button> `;
  };
};

export default Home;
