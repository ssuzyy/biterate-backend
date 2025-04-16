module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Review", {
    reviewID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userID: DataTypes.INTEGER,
    productID: DataTypes.INTEGER,
    productRating: DataTypes.FLOAT,
    description: DataTypes.TEXT,
    datePosted: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    storePurchasedAt: DataTypes.STRING,
    helpfulCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    unhelpfulCount: { type: DataTypes.INTEGER, defaultValue: 0 }
  });
};