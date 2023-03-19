import { InputType, Field } from 'type-graphql';
import { Gender } from '../../models';

@InputType()
export class LocationInput {
  @Field({ nullable: true })
  country: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  place?: string;
}

@InputType()
export class PersonInput {
  @Field({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  lastName: string;

  @Field(() => String, { nullable: true })
  gender: Gender;

  @Field({ nullable: true })
  middleName?: string;

  @Field({ nullable: true })
  dob?: string;

  @Field({ nullable: true })
  placeId?: string;

  @Field({ nullable: true })
  pobId?: string;

  @Field({ nullable: true })
  dod?: string;
}

@InputType()
export class PersonBirthInput {
  @Field({ nullable: false })
  childAttributes: PersonInput;
  @Field({ nullable: true })
  motherId?: string;
  @Field({ nullable: true })
  fatherId?: string;
  @Field({ nullable: true })
  parentId?: string;
  @Field({ nullable: true })
  parent2Id?: string;
}
