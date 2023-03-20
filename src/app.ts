import express, {
  json,
  urlencoded,
  Express,
  Request,
  Response,
  NextFunction,
} from "express";
import createError, { HttpError } from "http-errors";

import settings from "./graph/appSettings";
import { initializeGraphAPIClient } from "./graph/graphHelper";

import indexRouter from "./routes/index";

// Create an initialize our Express application object
const app: Express = express();

// Initialize the Microsoft Graph API
initializeGraphAPIClient(settings);

// Makes sure our API can only accept URL-encoded strings, or JSON data
app.use(json());
app.use(urlencoded({ extended: false }));

// Define our endpoints (routers) that are made available for our API
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: "error" });
});

export default app;