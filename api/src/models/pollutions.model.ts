import { Sequelize, DataTypes, Model, Optional, ModelStatic } from "sequelize";

export interface PollutionAttributes {
  id: number;
  titre: string;
  type: string;
  description: string;
  date: string;
  lieu: string;
  latitude: number;
  longitude: number;
  photoUrl?: string | null;
  indice?: number | null; 
}

export interface PollutionCreationAttributes
  extends Optional<PollutionAttributes, "id" | "photoUrl" | "indice"> {}

export interface PollutionInstance
  extends Model<PollutionAttributes, PollutionCreationAttributes>,
    PollutionAttributes {}

export type PollutionModel = ModelStatic<PollutionInstance>;

export default function definePollutions(
  sequelize: Sequelize,
  _seq?: typeof Sequelize
): PollutionModel {
  const Pollutions = sequelize.define<PollutionInstance>(
    "pollution",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      titre: {
        type: DataTypes.STRING,
        allowNull: false
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      lieu: {
        type: DataTypes.STRING,
        allowNull: false
      },
      latitude: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      longitude: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      photoUrl: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      indice: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: { msg: "L'indice doit être un nombre entier." },
          min: { args: [0], msg: "L'indice doit être positif ou nul." }
        }
      }
    },
    {
      tableName: "pollution",
      freezeTableName: true,
      timestamps: false
    }
  );

  return Pollutions;
}
