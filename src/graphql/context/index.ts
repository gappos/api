import DataLoader from 'dataloader';

import { Location, Person } from '../../models';
import { PeopleLoader, placesLoader } from './loaders';
export * from './loaders';

export interface Context {
  placeLoader: DataLoader<string, Location>;
  peopleLivingLoader: DataLoader<string, Person[]>;
  peopleBornLoader: PeopleLoader;
}

export const graphqlContext = (): Context => ({
  placeLoader: new DataLoader(placesLoader),
  peopleLivingLoader: new PeopleLoader('placeId'),
  peopleBornLoader: new PeopleLoader('pobId'),
});
