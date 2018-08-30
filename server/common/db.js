import mongoose from "mongoose";
import {
  DB_NAME,
  MONGO_PORT,
  MONGO_URL
} from "./util/secrets";

// help to debug mongoose
if (process.env.NODE_ENV !== 'test') {
  mongoose.set("debug", true);
}

// mongoose connect
mongoose.connect(`mongodb://${MONGO_URL}:${MONGO_PORT}/${DB_NAME}`);

export default mongoose;
