module.exports = (sequelize, DataTypes) => {
  return sequelize.define("User", {
    userID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING },
    joinDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    userRating: { type: DataTypes.FLOAT, defaultValue: 0 }
  });
};