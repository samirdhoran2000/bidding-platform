const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
   
    static associate(models) {
    }
  }
  Notification.init({
    user_id: DataTypes.INTEGER,
    message: DataTypes.STRING,
    is_read: DataTypes.BOOLEAN,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};