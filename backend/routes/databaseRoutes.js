import express from "express";
import connectDatabase from "../controllers/databaseController.js";

const router = express.Router();

router.post("/connect-db", connectDatabase);

export default router;