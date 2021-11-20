import express from "express";
import "express-async-errors";  // handles errors when using async functions for route handlers
import path from "path";
import cors from "cors";
import logger from "loglevel";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { getRoutes } from "./routes";
import { errorMiddleware, setupCloseOnExit } from "./middleware/error";

dotenv.config();

function startServer({ port = process.env.PORT } = {}) {
  const app = express();
  app.use(morgan("dev"));
  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());

  app.use("/api/v1", getRoutes());

  // Generic error handler if errors are missed by 'express-async-errors' middleware
  app.use(errorMiddleware);

  // When pushed to production, the react app will be served using express.static() middleware
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve(__dirname, "../client/build")));

    // Any request not caught by the API will be routed to the built react app
    app.get("*", function (req, res) {
      res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
    });
  }

  // Starts and closes the express app
  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      logger.info(`\n\tListening on port: ${server.address().port}\n`);

      const originalClose = server.close.bind(server);
      server.close = () => {
        return new Promise((resolveClose) => {
          originalClose(resolveClose);
        });
      };
      // Closes the server when the program exits
      setupCloseOnExit(server);
      resolve(server);
    });
  });
}

export { startServer };
