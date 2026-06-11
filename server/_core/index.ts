import "dotenv/config";
import express from "express";
import fs from "node:fs";
import { createServer } from "http";
import path from "node:path";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Railway Health Check - MUST be first and have no dependencies
  app.get("/health", (_req, res) => {
    res.status(200).setHeader('Content-Type', 'text/plain').send("OK");
  });
  
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  
  // Register middleware
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
    
    // Catch-all route for SPA in production
    app.get("*", (req, res) => {
      const distPath = path.resolve(import.meta.dirname, "public");
      const indexPath = path.resolve(distPath, "index.html");
      
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        console.error(`[SPA] Index not found at: ${indexPath}`);
        console.error(`[SPA] Current dirname: ${import.meta.dirname}`);
        res.status(404).send(`Frontend build not found. Path: ${indexPath}`);
      }
    });
  }

  // Railway provides PORT env var, use it directly
  const port = parseInt(process.env.PORT || "3000", 10);

  server.listen(port, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${port}/`);
  });
}

startServer().catch(console.error);
