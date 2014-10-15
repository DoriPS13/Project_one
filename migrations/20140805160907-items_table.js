module.exports = {
  up: function(migration, DataTypes, done) {
    // add altering commands here, calling 'done' when finished
    migration.createTable('items',
    	{id: {
    		type: DataTypes.INTEGER,
    		primaryKey: true,
    		autoIncrement: true
    	},
    	createdAt: DataTypes.DATE,
    	updatedAt: DataTypes.DATE,
    	locuId: {
    		type: DataTypes.STRING,
    	},
    	ratingCount: {
    		type: DataTypes.INTEGER,
    	},
    	rating: {
    		type: DataTypes.INTEGER
    	}
    })

    .complete(done);
  },
  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    migration.dropTable('users')
      .complete(done);
  }
};