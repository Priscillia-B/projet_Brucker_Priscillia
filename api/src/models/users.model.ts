import { Sequelize, DataTypes, Model, Optional, ModelStatic } from "sequelize";

export interface UserAttributes {
  id: number;
  login: string;
  prenom: string;
  nom: string;
  email: string;
  password: string;
}

export interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

export interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {}

export type UserModel = ModelStatic<UserInstance>;

export default function defineUsers(
  sequelize: Sequelize,
  _seq?: typeof Sequelize
): UserModel {
  const Users = sequelize.define<UserInstance>(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      login: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { notEmpty: true }
      },
      prenom: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true }
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      tableName: "users",
      freezeTableName: true,
      timestamps: false,
      // Le mot de passe n'est jamais renvoyé par les requêtes de lecture
      defaultScope: {
        attributes: { exclude: ["password"] }
      }
    }
  );

  return Users;
}
