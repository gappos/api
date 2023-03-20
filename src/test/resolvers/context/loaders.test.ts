import expect from 'expect';

import { clearDB, createLocationForTest, createPersonForTest } from '../../utils/utils';
import { graphqlContext } from '../../../graphql';

describe('context for resolvers', () => {
  const placeLiving = createLocationForTest();
  const placeBorn = createLocationForTest();
  const people = [
    createPersonForTest(placeLiving.id, placeBorn.id),
    createPersonForTest(placeLiving.id, placeBorn.id),
    createPersonForTest(placeLiving.id, placeBorn.id),
  ];
  const ctx = graphqlContext();

  before(async () => {
    await placeLiving.save();
    await placeBorn.save();
    people.forEach(async (person) => await person.save());
  });

  after(async () => {
    await clearDB();
  });

  it('should load correct places for persons', async () => {
    for (const person of people) {
      const location = await ctx.placeLoader.load(person.placeId);
      expect(location.id).toEqual(person.placeId);
    }
  });

  it('should load correct places of birth for persons', async () => {
    for (const person of people) {
      const location = await ctx.placeLoader.load(person.pobId);
      expect(location.id).toEqual(person.pobId);
    }
  });

  it('should load correct people as personsLiving', async () => {
    const persons = await ctx.peopleLivingLoader.load(placeLiving.id);
    expect(persons.map(({ dataValues }) => dataValues)).toEqual(
      people.map(({ dataValues }) => dataValues),
    );
  });

  it('should load correct people as personsBorn', async () => {
    const persons = await ctx.peopleBornLoader.load(placeBorn.id);
    expect(persons.map(({ dataValues }) => dataValues)).toEqual(
      people.map(({ dataValues }) => dataValues),
    );
  });
});
