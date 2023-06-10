import { Router } from "promethium-js";

const router = new Router({
  Home: "/home",
  About: "/about",
} as const);

export const { Link, Switch, paths } = router;
