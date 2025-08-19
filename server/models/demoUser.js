import sequelize from "../sequelize.js";
import { DataTypes } from "sequelize";

const User = sequelize.define("User", {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
});

export default User;
