import { Field, ObjectType } from 'type-graphql';

@ObjectType({ description: 'Country object' })
export class Country {
  constructor(country: string) {
    this.country = country;
    this.cities = [];
    this.places = [];
  }

  @Field()
  country: string;

  @Field(() => [City])
  cities: City[];

  @Field(() => [Place])
  places: Place[];
}

@ObjectType({ description: 'City object' })
export class City {
  @Field()
  locationId: string;

  @Field()
  city: string;
}

@ObjectType({ description: 'Place object' })
export class Place {
  @Field()
  locationId: string;

  @Field()
  place: string;
}
