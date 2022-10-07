const express = require("express");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
const colors = require("colors")
// const mongoose = require("mongoose");
const uploads = require("./routers/files");

dotenv.config({
	path: "./config/config.env",
});

// connectDB()
app.use(cors());
app.use(express.json());
app.use(
	express.urlencoded({
		extended: false,
	})
);

app.use(errorHandler);
// const conn = mongoose.createConnection(mongo_uri);

app.use("/", uploads);


const port = process.env.PORT || 4000;
const server = app.listen(port, console.log(`server running on port ${port}`));
process.on("unhandledRejection", (err, promise) => {
	console.log(`Error: ${err.message}`);
	server.close(() => process.exit(1));
});
