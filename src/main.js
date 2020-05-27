import { router } from "./router/index.routes";

import "bootstrap/dist/css/bootstrap.min.css";
import "./sass/main.scss";

const init = () => {
  router(window.location.hash);

  window.addEventListener("hashchange", () => {
    router(window.location.hash);
  });
};

window.addEventListener("load", init);
