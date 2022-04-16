'use strict';
const {Sequelize ,Model} = require('sequelize');
const sequelize = require('../config/db');


  class conversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  conversation.init({
    is_deleted: {
      defaultValue: 0,
      type: Sequelize.BOOLEAN, 
    },
  }, {
    sequelize,
    modelName: 'conversation',
  });

module.exports= conversation;
