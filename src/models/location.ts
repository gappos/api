import { Optional } from 'sequelize/types';
import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Field, InputType, ObjectType } from 'type-graphql';
import { Person } from './person';
import { getAddress } from './utils';

export interface LocationAttributes {
  id: string;
  country: string;
  city?: string;
  place?: string;
}
type LocationAttributesDefaultValues = 'id';

export type LocationCreationAttributes = Optional<
  LocationAttributes,
  LocationAttributesDefaultValues
>;

@ObjectType({ description: 'Location entity' })
@Table({
  schema: 'public',
  modelName: 'location',
  tableName: 'location',
  underscored: true,
  timestamps: false,
})
export class Location
  extends Model<LocationAttributes, LocationCreationAttributes>
  implements LocationAttributes
{
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Unique
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  @Field()
  @Column
  id: string;

  @Field()
  @AllowNull(false)
  @Column
  country: string;

  @Field({ nullable: true })
  @AllowNull(true)
  @Column
  city?: string;

  @Field()
  address(): string {
    return getAddress(this.place, this.city, this.country);
  }

  @Field({ nullable: true })
  @AllowNull(true)
  @Column
  place?: string;

  @Field(() => [Person], { nullable: true })
  @HasMany(() => Person, 'placeId')
  personsLiving: Person[];

  @Field(() => [Person], { nullable: true })
  @HasMany(() => Person, 'pobId')
  personsBorn: Person[];
}

@InputType()
export class LocationInput {
  @Field()
  country: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  place?: string;
}
