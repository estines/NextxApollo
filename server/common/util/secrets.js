import dotenv from "dotenv";
import fs from "fs";
import logger from "./logger";

let envFile = ".env";
if (process.env.NODE_ENV === 'test') {
	envFile = ".test";
}

logger.log("info", `Using ${envFile} file to supply config environment variables`);
dotenv.config({ path: envFile });

export const MONGO_PORT = process.env.MONGO_PORT;
export const MONGO_URL = process.env.MONGO_URL;
export const DB_NAME = process.env.DB_NAME;
export const CLIENT_ID = process.env.CLIENT_ID;
export const JWT_SECRET = process.env.JWT_SECRET;
