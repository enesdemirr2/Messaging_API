'use strict';
const User = require('./user');
const Conversation = require('./conversation');
const {Sequelize, Model} = require('sequelize');
const sequelize = require('../config/db');


  class participants extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsToMany(Conversation, { through: participants, foreignKey: 'user_id' });
      Conversation.belongsToMany(User, { through: participants, foreignKey: 'conversation_id' });
    }
  }
  participants.init({
    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      }
    },
    conversation_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'conversations',
        key: 'id',
      }
    },
    is_deleted: {
      defaultValue: 0,
      type: Sequelize.BOOLEAN,
    },
  }, {
    sequelize,
    modelName: 'participants',
  });

module.exports = participants;