'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Post}) {
      // define association here
      this.hasMany(Post,{foreignKey:'userId', as: 'posts'});
    }
    toJSON(){
      return {...this.get(),id:undefined}
    }
  };
  User.init({
    uuid:{
      type:DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4,
    },
    name: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{msg:'Name for User is must'},
        notEmpty:{msg:'Name cannot be Empty'}
      }
    },
    email: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{msg:'email for User is must'},
        notEmpty:{msg:'email cannot be Empty'},
        isEmail: {msg : 'email must be in a@b.com format'}
      }
    },
    role: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{msg:'Role for User is must'},
        notEmpty:{msg:'Role cannot be Empty'}
      }
    }
  }, {
    sequelize,
    tableName: 'users',
    modelName: 'User',
  });
  return User;
};
