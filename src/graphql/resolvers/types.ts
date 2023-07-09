import { InputType, Field } from 'type-graphql';
import { Gender, ParentRelation } from '../../models';

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

@InputType()
export class SpouseInput {
  @Field({ nullable: false })
  partner1Id: string;
  @Field({ nullable: false })
  partner2Id: string;
  @Field({ nullable: true })
  wedding?: string;
  @Field({ nullable: true })
  divorce?: string;
}

@InputType()
export class PersonMarriageInput {
  @Field({ nullable: false })
  partner1Id: string;
  @Field({ nullable: false })
  partner2Id: string;
}

@InputType()
export class ChildInput {
  @Field({ nullable: false })
  childId: string;

  @Field({ nullable: true })
  parentId?: string;

  @Field({ nullable: true })
  relation?: ParentRelation;
}

@InputType()
export class ChildRelationsInput {
  @Field({ nullable: false })
  childId: string;

  @Field({ nullable: true })
  parent1Id?: string;

  @Field({ nullable: true })
  parent1relation?: ParentRelation;

  @Field({ nullable: true })
  parent2Id?: string;

  @Field({ nullable: true })
  parent2relation?: ParentRelation;
}

@InputType()
export class PersonSearch extends PersonInput {
  name?: string;
}

@InputType()
export class LocationSearch extends LocationInput {
  address?: string;
}

@InputType()
export class PeopleSearchInput {
  @Field(() => PersonSearch, { nullable: true })
  person?: Partial<PersonSearch>;
  @Field(() => PersonSearch, { nullable: true })
  parents?: Partial<PersonSearch>;
  @Field(() => PersonSearch, { nullable: true })
  children?: Partial<PersonSearch>;
  @Field(() => PersonSearch, { nullable: true })
  spouses?: Partial<PersonSearch>;
  @Field(() => LocationSearch, { nullable: true })
  place?: Partial<LocationSearch>;
  @Field(() => LocationSearch, { nullable: true })
  placeOfBirth?: Partial<LocationSearch>;
}

export const dateFields = ['dob', 'dod', 'wedding', 'divorce'];
