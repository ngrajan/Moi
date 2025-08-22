import sequelize from "../sequelize.js";
import { DataTypes } from "sequelize";
import User from "./usersModel.js";

const Event = sequelize.define("Event", {
  eventName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  eventType: {
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
  giftType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  giftQuantity: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  giver: {
    type: DataTypes.ENUM("us", "others"),
    defaultValue: "others",
    allowNull: false,
  },
});

// Associations
User.hasMany(Event, { foreignKey: "user_id", as: "events" });
Event.belongsTo(User, { foreignKey: "user_id", as: "user" });

export default Event;
