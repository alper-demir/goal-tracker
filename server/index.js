import express from "express"
import dotenv from "dotenv"
import database from "./config/database.js"
import cors from "cors"
import route from "./router/route.js"
const app = express();
dotenv.config();

app.use(cors());
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

app.use("/api", route);
database();
const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server runs on port: ${PORT}`);
})