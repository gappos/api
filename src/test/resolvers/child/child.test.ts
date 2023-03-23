import expect from 'expect';
import { ChildAttributesInput } from '../../../graphql';

import { ChildResolvers } from '../../../graphql/resolvers/child';
import { Child, ParentRelation } from '../../../models';
import { clearDB, createPersonForTest } from '../../utils/utils';

describe('ChildResolvers', () => {
  const addChildResolver = new ChildResolvers().addChild;
  const personChild = createPersonForTest();
  const personMother = createPersonForTest();
  const personFather = createPersonForTest();

  before(async () => {
    personChild.save();
    personMother.save();
    personFather.save();
  });

  after(async () => {
    await clearDB();
  });

  afterEach(async () => {
    await Child.destroy({ where: {} });
  });

  it('should create father and mother relations', async () => {
    const childAttributes: ChildAttributesInput = {
      childId: personChild.id,
      parent1Id: personMother.id,
      parent1relation: ParentRelation.MOTHER,
      parent2Id: personFather.id,
      parent2relation: ParentRelation.FATHER,
    };

    expect(await addChildResolver(childAttributes)).toBeTruthy();

    const parents = await Child.findAll({ where: { childId: personChild.id } });
    expect(parents.length).toBe(2);
    expect(parents.map(({ dataValues }) => ({ ...dataValues })).sort()).toEqual(
      [
        { childId: personChild.id, parentId: personMother.id, relation: ParentRelation.MOTHER },
        { childId: personChild.id, parentId: personFather.id, relation: ParentRelation.FATHER },
      ].sort(),
    );
  });

  it('should create single mother relation', async () => {
    const childAttributes: ChildAttributesInput = {
      childId: personChild.id,
      parent1Id: personMother.id,
      parent1relation: ParentRelation.MOTHER,
    };

    expect(await addChildResolver(childAttributes)).toBeTruthy();

    const parents = await Child.findAll({ where: { childId: personChild.id } });
    expect(parents.length).toBe(1);
    expect(parents[0].dataValues).toEqual({
      childId: personChild.id,
      parentId: personMother.id,
      relation: ParentRelation.MOTHER,
    });
  });

  it('should create single parent relation', async () => {
    const childAttributes: ChildAttributesInput = {
      childId: personChild.id,
      parent1Id: personMother.id,
    };

    expect(await addChildResolver(childAttributes)).toBeTruthy();

    const parents = await Child.findAll({ where: { childId: personChild.id } });
    expect(parents.length).toBe(1);
    expect(parents[0].dataValues).toEqual({
      childId: personChild.id,
      parentId: personMother.id,
      relation: ParentRelation.PARENT,
    });
  });

  it('should create no relations', async () => {
    const childAttributes: ChildAttributesInput = {
      childId: personChild.id,
    };

    expect(await addChildResolver(childAttributes)).toBeFalsy();

    const parents = await Child.findAll({ where: { childId: personChild.id } });
    expect(parents.length).toBe(0);
  });
});
