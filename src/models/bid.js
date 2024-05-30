'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bid extends Model {
    
    static associate(models) {
    }
  }
  Bid.init({
    item_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    bid_amount: DataTypes.DECIMAL,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Bid',
  });
  return Bid;
};