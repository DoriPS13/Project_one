module.exports = function(sequelize, DataTypes) {
  var user_items = sequelize.define('user_items', {
      userId: {
        type: DataTypes.INTEGER,
        foreignKey: true
      },
      itemId: {
        type: DataTypes.INTEGER,
        foreignKey: true
      }
  }, {
    classMethods: {
      associate: function(db) {
         user_items.belongsTo(db.user);
         user_items.belongsTo(db.item);
      }
    }
  })

  return user_items
}
