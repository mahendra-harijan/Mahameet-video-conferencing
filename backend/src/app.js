import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

if (process.env.NODE_ENV !== "production") {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    dotenv.config({ path: path.resolve(__dirname, "..", ".env") });
}
import express from "express";
import { createServer } from "node:http";

import { Server } from "socket.io";

import mongoose from "mongoose";
import { connectToSocket } from "./controllers/socketManager.js";

import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import userRoutes from "./routes/users.routes.js";

const app = express();
const server = createServer(app);

const allowedOrigins = (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

const isOriginAllowed = (origin) => {
    if (!origin) return true;
    if (allowedOrigins.length === 0) return false;
    return allowedOrigins.includes(origin);
};

const io = connectToSocket(server, { allowedOrigins });


// Allow overriding port via env var to avoid EADDRINUSE in dev.
app.set("port", Number(process.env.PORT) || 8000)

app.set("trust proxy", 1);

app.use(
    cors({
        origin: (origin, cb) => {
            if (isOriginAllowed(origin)) return cb(null, true);
            return cb(new Error("Not allowed by CORS"));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(
    helmet({
        crossOriginResourcePolicy: false,
    })
);

app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: Number(process.env.RATE_LIMIT_MAX) || 300,
        standardHeaders: true,
        legacyHeaders: false,
    })
);
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use("/api/v1/users", userRoutes);

const start = async () => {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        throw new Error(
            "Missing MONGODB_URI. Create backend/.env with MONGODB_URI=<your mongo connection string>"
        );
    }

    if (process.env.NODE_ENV === "production" && allowedOrigins.length === 0) {
        throw new Error(
            "Missing CORS_ORIGINS in production. Set it to your Vercel domain(s), comma-separated."
        );
    }

    const connectionDb = await mongoose.connect(mongoUri)

    console.log(`MONGO Connected Sucessfully`)
    server.listen(app.get("port"), () => {
        console.log(`LISTENING ON PORT ${app.get("port")}`)
    });



}



start();