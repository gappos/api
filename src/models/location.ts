import { Optional } from 'sequelize/types';
import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { ArgsType, Field, ObjectType } from 'type-graphql';

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

  @Field({ nullable: true })
  @AllowNull(true)
  @Column
  place?: string;

  @Field({ nullable: true })
  xnr?: string;
  @Field({ nullable: true })
  dlb?: string;
}

@ArgsType()
export class LocationArgs {
  @Field({ nullable: true })
  xnr?: string;
  @Field({ nullable: true })
  dlb?: string;
}
