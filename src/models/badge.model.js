module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Badge", {
    badgeID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    criteria: DataTypes.TEXT,
    rarityLevel: DataTypes.STRING
  });
};