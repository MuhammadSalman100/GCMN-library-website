import express from "express";
import session from "express-session";
import pgSession from "connect-pg-simple";
import { pool } from "../server/db";
import { registerRoutes } from "../server/routes";

declare module "express-session" {
    interface SessionData {
        userId?: string;
        isAdmin?: boolean;
        isLibraryCard?: boolean;
    }
}

const PostgresStore = pgSession(session);

const app = express();
app.use(express.json({ limit: '1024mb' }));
app.use(express.urlencoded({ extended: false, limit: '1024mb' }));

// Use PostgreSQL session store for Vercel
app.use(
    session({
        store: new PostgresStore({
            pool: pool,
            tableName: "session",
            createTableIfMissing: true,
        }),
        resave: false,
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET || "gcmn-library-secret-2024",
        cookie: {
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            secure: process.env.NODE_ENV === "production",
        },
    })
);

registerRoutes(app);

export default app;
