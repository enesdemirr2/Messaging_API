'use strict';
const {Sequelize, Model} = require('sequelize');
const sequelize = require('../config/db');

  class messages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  messages.init({
    conversation_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'conversations',
        key: 'id',
      }
    },
    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      }
    },
    text: {
      allowNull: false,
      type: Sequelize.TEXT,
    },
    is_deleted: {
      defaultValue: 0,
      type: Sequelize.BOOLEAN
    },
  }, {
    sequelize,
    modelName: 'messages',
  });

module.exports = messages;
  