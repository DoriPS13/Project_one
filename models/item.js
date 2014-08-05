function Item(sequelize, DataTypes){
  return sequelize.define('post', {
    post: DataTypes.STRING
  });
};



module.exports = Item;