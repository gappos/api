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
import { ParentRelation } from './types';

export interface ChildAttributes {
  childId: string;
  parentId: string;
  relation: ParentRelation;
}

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

  @Column
  relation: ParentRelation;
}
