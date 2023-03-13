'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // 1. Posts 모델에서
      this.belongsTo(models.Users, { // 2. Users 모델에게 N:1 관계 설정을 합니다.
        targetKey: 'userId', // 3. Users 모델의 userId 컬럼을
        foreignKey: 'userId', // 4. Posts 모델의 userId 컬럼과 연결합니다.
      });

      this.hasMany(models.Likes, {
        sourceKey: 'postId',
        foreignKey: 'postId',
      });

      this.hasMany(models.Comments, {
        sourceKey: 'postId',
        foreignKey: 'postId',
      });
    }
  }
  Posts.init({
    postId: {
      allowNull: false, // NOT NULL
      autoIncrement: true, // AUTO_INCREMENT
      primaryKey: true, // Primary Key (기본키)
      type: DataTypes.INTEGER,
    },
    userId : {
      allowNull: false, // NOT NULL
      type: DataTypes.INTEGER,
    },
    nickname: {
      allowNull: false, // NOT NULL
      type: DataTypes.STRING,
    },
    title: {
      allowNull: false, // NOT NULL
      type: DataTypes.STRING,
    },
    content: {
      allowNull: false, // NOT NULL
      type: DataTypes.STRING,
    },
    createdAt: {
      allowNull: false, // NOT NULL
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false, // NOT NULL
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'Posts',
  });
  return Posts;
};