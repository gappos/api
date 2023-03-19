import expect from 'expect';

import { PersonEventsResolvers, PersonInput } from '../../../graphql';
import { Child, Person, Location, Gender, ParentRelation } from '../../../models';
import { createLocationForTest, createPersonForTest, randomString } from '../../utils/utils';

describe('events mutations', () => {
  describe('birth', () => {
    const placeLiving = createLocationForTest();
    const placeBorn = createLocationForTest();
    const personMother = createPersonForTest(placeLiving.id, placeBorn.id);
    const personFather = createPersonForTest(placeLiving.id, placeBorn.id);
    const personParent = createPersonForTest(placeLiving.id, placeBorn.id);

    const personEventResolvers = new PersonEventsResolvers();

    before(async () => {
      await placeLiving.save();
      await placeBorn.save();
      await personMother.save();
      await personFather.save();
      await personParent.save();
    });

    after(async () => {
      await Child.destroy({ where: {} });
      await Person.destroy({ where: {} });
      await Location.destroy({ where: {} });
    });

    describe('create a newborn to a mother and a father', () => {
      const childAttributes: PersonInput = {
        firstName: randomString(),
        lastName: randomString(),
        gender: Gender.FEMALE,
      };
      let newborn: Person | null;

      before(async () => {
        await personEventResolvers.birth({
          childAttributes,
          motherId: personMother.id,
          fatherId: personFather.id,
        });

        newborn = await Person.findOne({
          where: {
            firstName: childAttributes.firstName,
            lastName: childAttributes.lastName,
          },
        });
      });

      after(async () => {
        newborn?.destroy();
      });

      it('should create a new person', async () => {
        expect(newborn).toBeTruthy();
        expect({
          firstName: newborn?.firstName,
          lastName: newborn?.lastName,
          gender: newborn?.gender,
        }).toEqual({
          firstName: childAttributes.firstName,
          lastName: childAttributes.lastName,
          gender: childAttributes.gender,
        });
      });

      it('should create a new mother-child record', async () => {
        const motherChild = await Child.findOne({
          where: {
            childId: newborn?.id,
            parentId: personMother.id,
          },
        });

        expect(motherChild).toBeTruthy();
        expect({
          childId: motherChild?.childId,
          parentId: motherChild?.parentId,
          relation: motherChild?.relation,
        }).toEqual({
          childId: newborn?.id,
          parentId: personMother.id,
          relation: ParentRelation.MOTHER,
        });
      });

      it('should create a new father-child record', async () => {
        const fatherChild = await Child.findOne({
          where: {
            childId: newborn?.id,
            parentId: personFather.id,
          },
        });

        expect(fatherChild).toBeTruthy();
        expect({
          childId: fatherChild?.childId,
          parentId: fatherChild?.parentId,
          relation: fatherChild?.relation,
        }).toEqual({
          childId: newborn?.id,
          parentId: personFather.id,
          relation: ParentRelation.FATHER,
        });
      });
    });

    describe('create a newborn to a father and his partner', () => {
      const childAttributes: PersonInput = {
        firstName: randomString(),
        lastName: randomString(),
        gender: Gender.FEMALE,
      };
      let newborn: Person | null;

      before(async () => {
        await personEventResolvers.birth({
          childAttributes,
          fatherId: personFather.id,
          parentId: personParent.id,
        });

        newborn = await Person.findOne({
          where: {
            firstName: childAttributes.firstName,
            lastName: childAttributes.lastName,
          },
        });
      });

      after(async () => {
        newborn?.destroy();
      });

      it('should create a new person', async () => {
        expect(newborn).toBeTruthy();
        expect({
          firstName: newborn?.firstName,
          lastName: newborn?.lastName,
          gender: newborn?.gender,
        }).toEqual({
          firstName: childAttributes.firstName,
          lastName: childAttributes.lastName,
          gender: childAttributes.gender,
        });
      });

      it('should create a new father-child record', async () => {
        const fatherChild = await Child.findOne({
          where: {
            childId: newborn?.id,
            parentId: personFather.id,
          },
        });

        expect(fatherChild).toBeTruthy();
        expect({
          childId: fatherChild?.childId,
          parentId: fatherChild?.parentId,
          relation: fatherChild?.relation,
        }).toEqual({
          childId: newborn?.id,
          parentId: personFather.id,
          relation: ParentRelation.FATHER,
        });
      });

      it('should create a new parent-child record', async () => {
        const parentChild = await Child.findOne({
          where: {
            childId: newborn?.id,
            parentId: personParent.id,
          },
        });

        expect(parentChild).toBeTruthy();
        expect({
          childId: parentChild?.childId,
          parentId: parentChild?.parentId,
          relation: parentChild?.relation,
        }).toEqual({
          childId: newborn?.id,
          parentId: personParent.id,
          relation: ParentRelation.PARENT,
        });
      });
    });

    describe('create a newborn to a mother only', () => {
      const childAttributes: PersonInput = {
        firstName: randomString(),
        lastName: randomString(),
        gender: Gender.FEMALE,
      };
      let newborn: Person | null;

      before(async () => {
        await personEventResolvers.birth({
          childAttributes,
          motherId: personMother.id,
        });

        newborn = await Person.findOne({
          where: {
            firstName: childAttributes.firstName,
            lastName: childAttributes.lastName,
          },
        });
      });

      after(async () => {
        newborn?.destroy();
      });

      it('should create a new person', async () => {
        expect(newborn).toBeTruthy();
        expect({
          firstName: newborn?.firstName,
          lastName: newborn?.lastName,
          gender: newborn?.gender,
        }).toEqual({
          firstName: childAttributes.firstName,
          lastName: childAttributes.lastName,
          gender: childAttributes.gender,
        });
      });

      it('should create a new and only child record', async () => {
        const children = await Child.findAll({
          where: {
            childId: newborn?.id,
          },
        });
        const [motherChild] = children;

        expect(children.length).toBe(1);
        expect({
          childId: motherChild?.childId,
          parentId: motherChild?.parentId,
          relation: motherChild?.relation,
        }).toEqual({
          childId: newborn?.id,
          parentId: personMother.id,
          relation: ParentRelation.MOTHER,
        });
      });
    });

    describe('create a newborn to a parent only', () => {
      const childAttributes: PersonInput = {
        firstName: randomString(),
        lastName: randomString(),
        gender: Gender.FEMALE,
      };
      let newborn: Person | null;

      before(async () => {
        await personEventResolvers.birth({
          childAttributes,
          parentId: personParent.id,
        });

        newborn = await Person.findOne({
          where: {
            firstName: childAttributes.firstName,
            lastName: childAttributes.lastName,
          },
        });
      });

      after(async () => {
        newborn?.destroy();
      });

      it('should create a new person', async () => {
        expect(newborn).toBeTruthy();
        expect({
          firstName: newborn?.firstName,
          lastName: newborn?.lastName,
          gender: newborn?.gender,
        }).toEqual({
          firstName: childAttributes.firstName,
          lastName: childAttributes.lastName,
          gender: childAttributes.gender,
        });
      });

      it('should create a new and only child record', async () => {
        const children = await Child.findAll({
          where: {
            childId: newborn?.id,
            parentId: personParent.id,
          },
        });

        const [parentChild] = children;

        expect(children.length).toBe(1);
        expect(parentChild).toBeTruthy();
        expect({
          childId: parentChild?.childId,
          parentId: parentChild?.parentId,
          relation: parentChild?.relation,
        }).toEqual({
          childId: newborn?.id,
          parentId: personParent.id,
          relation: ParentRelation.PARENT,
        });
      });
    });
  });
});
