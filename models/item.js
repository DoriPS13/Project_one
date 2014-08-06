function Item(sequelize, DataTypes){
  return sequelize.define('item', {
    item: DataTypes.STRING
  });
};



module.exports = Item;