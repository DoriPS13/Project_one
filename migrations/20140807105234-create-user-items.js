module.exports = {
  up: function(migration, DataTypes, done) {
    migration
      .createTable('user_items', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        userId: {
          type: DataTypes.INTEGER,
          foreignKey: true
        },
        itemId: {
          type: DataTypes.INTEGER,
          foreignKey: true
        }
      })
      .complete(done)
  },
  down: function(migration, DataTypes, done) {
    migration
      .dropTable('user_items')
      .complete(done)
  }
}
