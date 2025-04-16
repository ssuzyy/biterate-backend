module.exports = (sequelize, DataTypes) => {
  return sequelize.define("ReviewVote", {
    voteID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    reviewID: DataTypes.INTEGER,
    userID: DataTypes.INTEGER,
    voteType: { type: DataTypes.STRING, validate: { isIn: [['helpful', 'unhelpful']] } }
  });
};