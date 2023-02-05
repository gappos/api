import { Optional } from 'sequelize/types';
import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { Field, ObjectType } from 'type-graphql';
import { v4 as uuidv4 } from 'uuid';
import { Gender } from './types';
import { Location } from './location';

export interface PersonAttributes {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: Gender;
  dob: Date;
  dod?: Date;
  placeId?: string;
  pobId?: string;
}
type PersonAttributesDefaultValues = 'id';

export type PersonCreationAttributes = Optional<
  PersonAttributes,
  PersonAttributesDefaultValues
>;

@ObjectType({
  description: 'Person',
})
@Table({
  schema: 'public',
  modelName: 'person',
  tableName: 'person',
  underscored: true,
  timestamps: false,
})
export class Person
  extends Model<PersonAttributes, PersonCreationAttributes>
  implements PersonAttributes
{
  @Field()
  @PrimaryKey
  @AutoIncrement
  @Unique
  @AllowNull(false)
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Field()
  @Column
  firstName: string;

  @AllowNull(false)
  @Field()
  @Column
  lastName: string;

  @AllowNull(true)
  @Field({ nullable: true })
  @Column
  middleName: string;

  @AllowNull(false)
  @Field(() => String)
  @Column(DataType.ENUM(...Object.values(Gender)))
  gender: Gender;

  @AllowNull(false)
  @Field(() => Date)
  @Column
  dob: Date;

  @Field(() => Date, { nullable: true })
  @Column
  dod: Date;

  @AllowNull(true)
  @ForeignKey(() => Location)
  @Column(DataType.UUID)
  placeId: string;

  @Field(() => Location, { nullable: true })
  @HasMany(() => Location, {
    foreignKey: 'placeId',
  })
  place: Location;

  @AllowNull(true)
  @ForeignKey(() => Location)
  @Column(DataType.UUID)
  pobId: string;

  @Field(() => Location, { nullable: true })
  @HasMany(() => Location, {
    foreignKey: 'pobId',
  })
  placeOfBirth: Location;
}
