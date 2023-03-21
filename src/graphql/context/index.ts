import DataLoader from 'dataloader';

import { Location, Person } from '../../models';
import { getPeopleLoader, getPlacesLoader } from './loaders';
export * from './loaders';

export interface Context {
  placeLoader: DataLoader<string, Location>;
  peopleLivingLoader: DataLoader<string, Person[]>;
  peopleBornLoader: DataLoader<string, Person[]>;
}

export const graphqlContext = (): Context => ({
  placeLoader: new DataLoader(getPlacesLoader()),
  peopleLivingLoader: new DataLoader(getPeopleLoader('placeId')),
  peopleBornLoader: new DataLoader(getPeopleLoader('pobId')),
});
