import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";

class App {
  public app: express.Application;
  public port: number;

  constructor(routers: express.Router[], port: number) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeSwagger();
    this.initializeControllers(routers);
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(cors());
  }

  private initializeSwagger() {
    this.app.use('/', swaggerUi.serve);
    this.app.get('/', swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'API To-Do List',
    }));
  }

  private initializeControllers(routers: express.Router[]) {
    routers.forEach((router) => {
      this.app.use(router);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      // eslint-disable-next-line no-console
      console.log(`App listening on the port ${this.port}`);
      console.log(`📚 Swagger UI available at http://localhost:${this.port}/`);
    });
  }
}

export default App;
