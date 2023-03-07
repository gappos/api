import DataLoader from 'dataloader';

import { Location } from '../../models';
import { PeopleLoader, placesLoader } from './loaders';
export * from './loaders';

export interface Context {
  placeLoader: DataLoader<string, Location>;
  peopleLivingLoader: PeopleLoader;
  peopleBornLoader: PeopleLoader;
}

export const graphqlContext = (): Context => ({
  placeLoader: new DataLoader(placesLoader),
  peopleLivingLoader: new PeopleLoader('placeId'),
  peopleBornLoader: new PeopleLoader('pobId'),
});
