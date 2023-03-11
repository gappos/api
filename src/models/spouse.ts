import {
  AllowNull,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { Person } from './person';

export interface SpouseAttributes {
  partner1Id: string;
  partner2Id: string;
  wedding: Date;
  divorce?: Date;
}

@Table({
  schema: 'public',
  tableName: 'spouse',
  modelName: 'spouse',
  underscored: true,
  timestamps: false,
})
export class Spouse extends Model<SpouseAttributes> implements SpouseAttributes {
  @PrimaryKey
  @AllowNull(false)
  @ForeignKey(() => Person)
  @Column(DataType.UUID)
  partner1Id: string;

  @PrimaryKey
  @AllowNull(false)
  @ForeignKey(() => Person)
  @Column(DataType.UUID)
  partner2Id: string;

  @AllowNull(false)
  @Column
  wedding: Date;

  @AllowNull(true)
  @Column
  divorce?: Date;
}
