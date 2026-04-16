import App from "./app";
import { envs } from "./envs";
import { userRoutes } from "./routes/user.routes";

const app = new App(
  [
    userRoutes
  ],
  envs.PORT,
);

app.listen();