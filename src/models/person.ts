import { Optional } from 'sequelize/types';
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
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
import { getName } from './utils';
import { Child } from './child';
import { Spouse } from './spouse';

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

export type PersonCreationAttributes = Optional<PersonAttributes, PersonAttributesDefaultValues>;

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

  @Field()
  name(): string {
    return getName(this.firstName, this.middleName, this.lastName);
  }

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

  @Field()
  @AllowNull(true)
  @ForeignKey(() => Location)
  @Column(DataType.UUID)
  placeId: string;

  @Field()
  @AllowNull(true)
  @ForeignKey(() => Location)
  @Column(DataType.UUID)
  pobId: string;

  @Field(() => [Person], { nullable: true })
  @HasMany(() => Spouse)
  spouses: Person[];

  @Field(() => [Person], { nullable: true })
  @HasMany(() => Child, 'parentId')
  children: Person[];

  @Field(() => [Person], { nullable: true })
  @HasMany(() => Child, 'childId')
  parents: Person[];

  @Field(() => Location, { nullable: true })
  @BelongsTo(() => Location, 'placeId')
  place: Location;

  @Field(() => Location, { nullable: true })
  @BelongsTo(() => Location, 'pobId')
  placeOfBirth: Location;
}
