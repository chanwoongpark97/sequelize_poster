'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // 1. Comments 모델에서
      this.belongsTo(models.Users, { // 2. Users 모델에게 N:1 관계 설정을 합니다. 
        targetKey: 'userId', // 3. Users 모델의 userId 컬럼을
        foreignKey: 'userId', // 4. Comments 모델의 userId 컬럼과 연결합니다.
      });
      // 1. Comments 모델에서
      this.belongsTo(models.Posts, { // 2. Posts 모델에게 N:1 관계 설정을 합니다. 
        targetKey: 'postId', // 3. Posts 모델의 postId 컬럼을
        foreignKey: 'postId', // 4. Comments 모델의 postId 컬럼과 연결합니다.
      });
    }
  }
  Comments.init({
    commentId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nickname: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    comment: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'Comments',
  });
  return Comments;
};