import dotenv from "dotenv";
dotenv.config();
import "./instrument"; // Instrumentation for code coverage and error tracking (Sentry)
import swaggerUi from "swagger-ui-express";
import { swaggerDocs } from "./docs/swagger";
import express from "express";
import path from "path";
import * as Sentry from "@sentry/node";

// Routes import
import authRoutes from "./routes/authRoutes";
import usersRoutes from "./routes/usersRoutes";
import shortenUrlRoutes from "./routes/shortenUrl";

const app = express();
const port = process.env.PORT || 80;

app.use(express.json()); // Body parser
// Serve arquivos estáticos (como HTML) da pasta 'views'
app.use(express.static(path.join(__dirname, "public")));

// Routes setup
app.use("/", shortenUrlRoutes);
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/doc/api", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

if (process.env.NODE_ENV !== "test") {
  // Error handler
  Sentry.setupExpressErrorHandler(app);

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

export default app;
