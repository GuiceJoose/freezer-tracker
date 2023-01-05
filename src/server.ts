require("dotenv").config();
import express from "express";

const port = process.env.PORT;
const app = express();

app.listen(5000, () => {
  console.log(`listening on port ${port}`);
});
