import {
  html,
  h,
  adaptState,
  adaptRenderEffect,
  adaptMemo,
} from "promethium-js";
import One from "./One";
import Todo from "./Todo";
import Two from "./Two";

export const [showOne, setShowOne] = adaptState(true);
export const [showTwo, setShowTwo] = adaptState(true);
export const [count, setCount] = adaptState(0);

const App = () => {
  const [showTodo, setShowTodo] = adaptState(true);

  const countAdd5 = adaptMemo(() => {
    console.log("memo updated");
    return count() + 5;
  });
  adaptRenderEffect((_, [count1 = 0]) => console.log(count(), count1), [count]);
  console.log("new");

  return () => {
    return html`
      <div>What the fuck is going on here??</div>
      <div>Count: ${count()}</div>
      <div>$Memo: ${countAdd5()}</div>
      <button @click=${() => setCount(count() + 1)}>Increment Count</button>
      <button @click=${() => setShowTodo(!showTodo())}>Toggle ShowTodo</button>
      <button @click=${() => setShowOne(!showOne())}>Toggle One</button>
      <button @click=${() => setShowTwo(!showTwo())}>Toggle Two</button>
      <button
        @click=${() => {
          setShowTodo(!showTodo());
          setShowOne(!showOne());
          setShowTwo(!showTwo());
        }}
      >
        Toggle All
      </button>
      ${showTodo()
        ? h(Todo, { text: "showing" })
        : //h(Todo, { text: "not showing" })
          ""}
      ${h(One)} ${h(Two)}
    `;
  };
};

export default App;
