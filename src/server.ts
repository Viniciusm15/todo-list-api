import App from "./app";
import { envs } from "./envs";
import { router } from "./routes";

const app = new App(
  [router],
  envs.PORT,
);

app.listen();