module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Product", {
    productID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    SKU: DataTypes.STRING,
    name: DataTypes.STRING,
    brand: DataTypes.STRING,
    category: DataTypes.STRING,
    ingredients: DataTypes.TEXT,
    createdByUserID: DataTypes.INTEGER
  });
};