import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import generateQuery from "./services/aiService.js";
import getDatabaseSchema from "./services/schemaService.js";
import executeQuery from "./services/sqlService.js";

import databaseRoutes from "./routes/databaseRoutes.js";

import session from "express-session";

import authRoutes from "./routes/authRoutes.js";
import requireAuth from "./middleware/authMiddleware.js";

import { getOrganizationDatabase } from "./services/databaseService.js";

import connectDatabase from "./controllers/databaseController.js";

import {
    saveQueryHistory,
    getQueryHistory
} from "./services/queryHistoryService.js";

import {
    logout
} from "./controllers/authController.js";

import path from "path";


dotenv.config();

const app = express();


// =========================
// MIDDLEWARE
// =========================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// =========================
// SESSION
// =========================

app.use(
    session({
        secret: process.env.SESSION_SECRET,

        resave: false,

        saveUninitialized: false,

        cookie: {
            httpOnly: true,

            secure:
                process.env.NODE_ENV === "production",
        },
    })
);


// =========================
// DATABASE ROUTES
// =========================

app.use("/", databaseRoutes);


// =========================
// EJS CONFIGURATION
// =========================

app.set(
    "view engine",
    "ejs"
);

app.set(
    "views",
    path.join(
        process.cwd(),
        "backend",
        "views"
    )
);

// =========================
// AUTH / PAGES
// =========================

app.get("/", (req, res) => {
    res.render("login");
});


app.get("/signup", (req, res) => {
    res.render("signup");
});


app.get("/login", (req, res) => {
    res.render("login");
});


app.post("/logout", logout);


app.get(
    "/dashboard",
    requireAuth,
    (req, res) => {
        res.render("dashboard");
    }
);


app.use("/", authRoutes);


app.get(
    "/connect-db",
    requireAuth,
    (req, res) => {
        res.render("connect-db");
    }
);


// =========================
// CUSTOMER DATABASE STATUS
// =========================

app.get(
    "/database-status",
    requireAuth,
    (req, res) => {

        try {

            const organizationId =
                req.session.organizationId;


            getOrganizationDatabase(
                organizationId
            );


            res.json({
                connected: true
            });

        } catch (error) {

            res.json({
                connected: false
            });

        }

    }
);


// =========================
// TEST CUSTOMER DATABASE
// =========================

app.get(
    "/test-db",
    requireAuth,
    async (req, res) => {

        try {

            const organizationId =
                req.session.organizationId;


            const db =
                getOrganizationDatabase(
                    organizationId
                );


            const collections =
                await db.db
                    .listCollections()
                    .toArray();


            res.json({
                connected: true,
                collections:
                    collections.map(
                        collection =>
                            collection.name
                    )
            });

        } catch (error) {

            console.error(error);


            res.status(500).json({
                message:
                    "Database connection failed"
            });

        }

    }
);


// =========================
// GET CUSTOMER DATABASE SCHEMA
// =========================

app.get(
    "/schema",
    requireAuth,
    async (req, res) => {

        try {

            const organizationId =
                req.session.organizationId;


            const schema =
                await getDatabaseSchema(
                    organizationId
                );


            res.json(schema);

        } catch (error) {

            console.error(error);


            res.status(503).json({
                message:
                    "Database is not connected"
            });

        }

    }
);


// =========================
// CONNECT CUSTOMER DATABASE
// =========================

app.post(
    "/connect-db",
    requireAuth,
    connectDatabase
);


// =========================
// RUN NATURAL LANGUAGE QUERY
// =========================

app.post(
    "/query",
    requireAuth,
    async (req, res) => {

        try {

            const organizationId =
                req.session.organizationId;


            const {
                question
            } = req.body;


            if (!question) {

                return res.status(400).json({
                    message:
                        "Question is required"
                });

            }


            // Get customer's MongoDB schema

            const schema =
                await getDatabaseSchema(
                    organizationId
                );


            // Generate MongoDB query

            const query =
                await generateQuery(
                    question,
                    schema
                );


            // Execute MongoDB query

            const result =
                await executeQuery(
                    query,
                    organizationId
                );


            // Save query history

            await saveQueryHistory(
                organizationId,
                question,
                query
            );


            res.json({
                question,
                query,
                result
            });

        } catch (error) {

            console.error(
                "QUERY ERROR:",
                error
            );


            res.status(500).json({
                message:
                    error.message
            });

        }

    }
);


// =========================
// QUERY HISTORY
// =========================

app.get(
    "/query-history",
    requireAuth,
    async (req, res) => {

        try {

            const organizationId =
                req.session.organizationId;


            const history =
                await getQueryHistory(
                    organizationId
                );


            res.json(history);

        } catch (error) {

            console.error(error);


            res.status(500).json({
                message:
                    "Could not load query history"
            });

        }

    }
);


// =========================
// START SERVER
// =========================

const startServer = async () => {

    try {

        // Connect QueryAI's own MongoDB database

        await connectDB();


        const PORT =
            process.env.PORT || 3000;


        app.listen(
            PORT,
            "0.0.0.0",
            () => {

                console.log(
                    `Server running on port ${PORT}`
                );

            }
        );

    } catch (error) {

        console.error(
            "Failed to start server:",
            error
        );


        process.exit(1);

    }

};


startServer();