import { Optional } from 'sequelize/types';
import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { Field, ObjectType } from 'type-graphql';

export interface BooksAttributes {
  id: number;
  title: string;
  author: string;
}
type BooksAttributesDefaultValues = 'id';

export type BooksCreationAttributes = Optional<BooksAttributes, BooksAttributesDefaultValues>;

@ObjectType({
  description: 'Book',
})
@Table({
  schema: 'public',
  modelName: 'book',
  tableName: 'book',
  underscored: true,
  timestamps: false,
})
export class Book
  extends Model<BooksAttributes, BooksCreationAttributes>
  implements BooksAttributes
{
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Unique
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @Column
  @Field()
  title: string;

  @AllowNull(false)
  @Column
  @Field()
  author: string;
}
