import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "postgres://postgres:postgres@localhost:5433/postgres",
  { logging: false }
);

sequelize
  .authenticate()
  .then(() => console.log("DB Connection Successfull"))
  .catch((err) => console.log("Error in DB Connection", err));

export default sequelize;
