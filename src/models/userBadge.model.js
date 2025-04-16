module.exports = (sequelize, DataTypes) => {
  return sequelize.define("UserBadge", {
    userID: { type: DataTypes.INTEGER, primaryKey: true },
    badgeID: { type: DataTypes.INTEGER, primaryKey: true },
    date_earned: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  });
};