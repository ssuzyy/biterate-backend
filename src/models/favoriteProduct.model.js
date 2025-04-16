module.exports = (sequelize, DataTypes) => {
  return sequelize.define("FavoriteProduct", {
    favoriteID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userID: DataTypes.INTEGER,
    productID: DataTypes.INTEGER
  });
};