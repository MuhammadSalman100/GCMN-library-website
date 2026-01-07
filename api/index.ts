import express from "express";
import session from "express-session";
import { registerRoutes } from "../server/routes";
import { storage } from "../server/json-storage";

declare module "express-session" {
    interface SessionData {
        userId?: string;
        isAdmin?: boolean;
        isLibraryCard?: boolean;
    }
}

const MemoryStore = require("memorystore")(session);

const app = express();
app.use(express.json({ limit: '1024mb' }));
app.use(express.urlencoded({ extended: false, limit: '1024mb' }));

app.use(
    session({
        cookie: { maxAge: 86400000 },
        store: new MemoryStore({
            checkPeriod: 86400000,
        }),
        resave: false,
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET || "gcmn-library-secret-2024",
    })
);

registerRoutes(app);

export default app;
