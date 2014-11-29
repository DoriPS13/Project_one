function Item(sequelize, DataTypes){
  Item = sequelize.define('item', {
    ratingCount: {
    	type: DataTypes.INTEGER,
    },
    rating: {
    	type: DataTypes.INTEGER,
    },
    locuId: {
    	type: DataTypes.STRING,
    }
  },{
  	classMethods: {
  		associate: function(db) {
        Item.hasMany(db.user, {through: db.user_items});
  		}
  	}
  });
  return Item;
}

module.exports = Item;