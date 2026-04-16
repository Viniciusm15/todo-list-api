import App from "./app";
import { envs } from "./envs";
import { userRoutes } from "./routes/user.routes";
import { authRoutes } from "./routes/auth.routes"

const app = new App(
  [
    userRoutes,
    authRoutes
  ],
  envs.PORT,
);

app.listen();