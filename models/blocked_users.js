'use strict';
const {Sequelize ,Model} = require('sequelize');
const sequelize = require('../config/db');


  class blocked_users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  blocked_users.init({
    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      }
    },
    target_user_id:{
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      }
    },
    is_deleted: {
      defaultValue: 0,
      type: Sequelize.BOOLEAN
    } 
  }, {
    sequelize,
    modelName: 'blocked_users',
  });

module.exports = blocked_users;