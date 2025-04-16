const dbConfig = require("../config/db.config.js");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: dbConfig.pool
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user.model.js")(sequelize, DataTypes);
db.Product = require("./product.model.js")(sequelize, DataTypes);
db.Review = require("./review.model.js")(sequelize, DataTypes);
db.ReviewVote = require("./reviewVote.model.js")(sequelize, DataTypes);
db.Badge = require("./badge.model.js")(sequelize, DataTypes);
db.UserBadge = require("./userBadge.model.js")(sequelize, DataTypes);
db.FavoriteProduct = require("./favoriteProduct.model.js")(sequelize, DataTypes);

db.User.hasMany(db.Product, { foreignKey: "createdByUserID" });
db.User.hasMany(db.Review, { foreignKey: "userID" });
db.User.hasMany(db.ReviewVote, { foreignKey: "userID" });
db.User.hasMany(db.UserBadge, { foreignKey: "userID" });
db.User.hasMany(db.FavoriteProduct, { foreignKey: "userID" });
db.Product.hasMany(db.Review, { foreignKey: "productID" });
db.Product.hasMany(db.FavoriteProduct, { foreignKey: "productID" });


// Relations
db.Product.belongsTo(db.User, { foreignKey: "createdByUserID" });
db.Review.belongsTo(db.User, { foreignKey: "userID" });
db.Review.belongsTo(db.Product, { foreignKey: "productID" });
db.ReviewVote.belongsTo(db.Review, { foreignKey: "reviewID" });
db.ReviewVote.belongsTo(db.User, { foreignKey: "userID" });
db.UserBadge.belongsTo(db.User, { foreignKey: "userID" });
db.UserBadge.belongsTo(db.Badge, { foreignKey: "badgeID" });
db.FavoriteProduct.belongsTo(db.User, { foreignKey: "userID" });
db.FavoriteProduct.belongsTo(db.Product, { foreignKey: "productID" });

module.exports = db;
