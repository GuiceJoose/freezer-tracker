import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Freezer } from "./entity/Freezer";
import { Item } from "./entity/Item";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: process.env.DB_PASSWORD,
  database: "freezer-tracker",
  entities: [User, Freezer, Item],
  synchronize: true,
  logging: false,
});
