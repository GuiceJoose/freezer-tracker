import "dotenv/config";
import express from "express";
import { AppDataSource } from "./data-source";

AppDataSource.initialize()
  .then(() => {
    console.log("data source intitialized");
  })
  .catch((error) => console.log(error));

const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use("/api/freezer-items", require("./routes/itemRoutes"));
// app.use("/api/freezers", require("./routes/freezerRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

app.listen(port, () => console.log(`Server started on port ${port}`));
