import { Resolver, Query } from 'type-graphql';

@Resolver()
export class VersionResolvers {
  @Query()
  prDateNumber(): string {
    return 'PR date and number: ' + process.env.PR_DATE_NUMBER;
  }
}
