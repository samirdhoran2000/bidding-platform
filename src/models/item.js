// src/models/item.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    static associate(models) {
      Item.hasMany(models.Bid, { foreignKey: "item_id" });
    }
  }
  Item.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      starting_price: { type: DataTypes.DECIMAL, allowNull: false },
      current_price: {
        type: DataTypes.DECIMAL,
        defaultValue: DataTypes.DECIMAL,
      },
      image_url: { type: DataTypes.STRING, allowNull: true },
      end_time: { type: DataTypes.DATE, allowNull: false },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      sequelize,
      modelName: "Item",
      underscored: true,
      timestamps: false,
    }
  );
  return Item;
};
