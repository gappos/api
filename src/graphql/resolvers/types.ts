import { InputType, Field } from 'type-graphql';

@InputType()
export class LocationInput {
  @Field({ nullable: true })
  country: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  place?: string;
}
