import expect from 'expect';
import captureStream from 'capture-stream';

import { ChildInput, ChildRelationsInput } from '../../../graphql';
import { ChildResolvers } from '../../../graphql/resolvers/child';
import { Child, ParentRelation } from '../../../models';
import { clearDB, createPersonForTest } from '../../utils/utils';

describe('ChildResolvers', () => {
  const childResolvers = new ChildResolvers();
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

  describe('addChild', () => {
    const childAttributes: ChildInput = {
      childId: personChild.id,
      parentId: personMother.id,
      relation: ParentRelation.MOTHER,
    };

    after(async () => {
      await Child.destroy({ where: {} });
    });

    it('should create child object', async () => {
      expect((await childResolvers.addChild(childAttributes))?.dataValues).toEqual(childAttributes);
    });

    it('should not create an object with the same parent-child relation', async () => {
      const outputStream = captureStream(process.stderr);

      expect(await childResolvers.addChild(childAttributes)).toBeFalsy();
      expect(outputStream(true)).toContain('Validation error');
    });
  });

  describe('addChildRelations', () => {
    afterEach(async () => {
      await Child.destroy({ where: {} });
    });

    it('should create father and mother relations', async () => {
      const childAttributes: ChildRelationsInput = {
        childId: personChild.id,
        parent1Id: personMother.id,
        parent1relation: ParentRelation.MOTHER,
        parent2Id: personFather.id,
        parent2relation: ParentRelation.FATHER,
      };

      const childRelations = await childResolvers.addChildRelations(childAttributes);

      expect(childRelations.length).toBe(2);
      expect(
        childRelations.map((childRelation) => ({ ...childRelation?.dataValues })).sort(),
      ).toEqual(
        [
          { childId: personChild.id, parentId: personMother.id, relation: ParentRelation.MOTHER },
          { childId: personChild.id, parentId: personFather.id, relation: ParentRelation.FATHER },
        ].sort(),
      );
    });

    it('should create single mother relation', async () => {
      const childAttributes: ChildRelationsInput = {
        childId: personChild.id,
        parent1Id: personMother.id,
        parent1relation: ParentRelation.MOTHER,
      };

      const childRelations = await childResolvers.addChildRelations(childAttributes);

      expect(childRelations.length).toBe(1);

      const childRelation = childRelations[0];
      expect(childRelation?.dataValues).toEqual({
        childId: personChild.id,
        parentId: personMother.id,
        relation: ParentRelation.MOTHER,
      });
    });

    it('should create single parent relation', async () => {
      const childAttributes: ChildRelationsInput = {
        childId: personChild.id,
        parent1Id: personMother.id,
      };

      const childRelations = await childResolvers.addChildRelations(childAttributes);

      expect(childRelations.length).toBe(1);
      const childRelation = childRelations[0];
      expect(childRelation?.dataValues).toEqual({
        childId: personChild.id,
        parentId: personMother.id,
        relation: ParentRelation.PARENT,
      });
    });

    it('should create no relations', async () => {
      const childAttributes: ChildRelationsInput = {
        childId: personChild.id,
      };

      const childRelations = await childResolvers.addChildRelations(childAttributes);

      expect(childRelations.length).toBe(0);
    });
  });
});
