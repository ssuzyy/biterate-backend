module.exports = (sequelize, DataTypes) => {
  return sequelize.define("User", {
    userID: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    email: { 
      type: DataTypes.STRING, 
      unique: true, 
      allowNull: false 
    },
    password: { 
      type: DataTypes.STRING,
      allowNull: true // Can be null for OAuth users
    },
    firebaseUid: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true // For backward compatibility with existing users
    },
    joinDate: { 
      type: DataTypes.DATE, 
      defaultValue: DataTypes.NOW 
    },
    userRating: { 
      type: DataTypes.FLOAT, 
      defaultValue: 0 
    }
  });
};