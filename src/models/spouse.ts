import {
  AllowNull,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Field, ObjectType } from 'type-graphql';

import { Person } from './person';

export interface SpouseAttributes {
  partner1Id: string;
  partner2Id: string;
  wedding: Date;
  divorce?: Date;
}

@ObjectType({ description: 'Spouse' })
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

  @Field({ nullable: true })
  @AllowNull(false)
  @Column
  wedding: Date;

  @Field({ nullable: true })
  @AllowNull(true)
  @Column
  divorce?: Date;
}
