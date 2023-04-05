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
import { ParentRelation } from './types';

export interface ChildAttributes {
  childId: string;
  parentId: string;
  relation: ParentRelation;
}

@ObjectType({ description: 'Child' })
@Table({
  schema: 'public',
  tableName: 'child',
  modelName: 'child',
  underscored: true,
  timestamps: false,
})
export class Child extends Model<ChildAttributes> implements ChildAttributes {
  @PrimaryKey
  @AllowNull(false)
  @ForeignKey(() => Person)
  @Column(DataType.UUID)
  childId: string;

  @PrimaryKey
  @AllowNull(false)
  @ForeignKey(() => Person)
  @Column(DataType.UUID)
  parentId: string;

  @Field()
  @Column
  relation: ParentRelation;
}
