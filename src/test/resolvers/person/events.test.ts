import expect from 'expect';

import { PersonEventsResolvers, PersonInput } from '../../../graphql';
import { Child, Person, Gender, ParentRelation, Spouse } from '../../../models';
import {
  clearDB,
  createLocationForTest,
  createPersonForTest,
  randomString,
} from '../../utils/utils';

describe('events mutations', () => {
  const personEventResolvers = new PersonEventsResolvers();

  after(async () => {
    await clearDB();
  });

  describe('birth', () => {
    const placeLiving = createLocationForTest();
    const placeBorn = createLocationForTest();
    const personMother = createPersonForTest(placeLiving.id, placeBorn.id);
    const personFather = createPersonForTest(placeLiving.id, placeBorn.id);
    const personParent = createPersonForTest(placeLiving.id, placeBorn.id);
    let newborn: Person | null;

    before(async () => {
      await placeLiving.save();
      await placeBorn.save();
      await personMother.save();
      await personFather.save();
      await personParent.save();
    });

    describe('create a newborn to a mother and a father', () => {
      const childAttributes: PersonInput = {
        firstName: randomString(),
        lastName: randomString(),
        gender: Gender.FEMALE,
      };

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

  describe('death', () => {
    const person = createPersonForTest();
    let personBeforeDeath: Person | null;

    before(async () => {
      await person.save();
      personBeforeDeath = await Person.findByPk(person.id);
    });

    it('should find the person with dod=NULL', async () => {
      expect(personBeforeDeath).toBeTruthy();
      expect(personBeforeDeath?.dod).toBe(null);
    });

    it('should dod be set for the person', async () => {
      await personEventResolvers.death(personBeforeDeath?.id as string);

      await personBeforeDeath?.reload();
      expect(personBeforeDeath?.dod).toBeTruthy();
    });
  });

  describe('marriage', () => {
    const partner1 = createPersonForTest();
    const partner2 = createPersonForTest();

    before(async () => {
      await partner1.save();
      await partner2.save();
      await personEventResolvers.marriage({ partner1Id: partner1.id, partner2Id: partner2.id });
    });

    it('should find a rec in spouse', async () => {
      const marriage = await Spouse.findOne({
        where: { partner1Id: partner1.id, partner2Id: partner2.id },
      });
      expect(marriage).toBeTruthy();
    });
  });

  describe('divorce', () => {
    const partner1 = createPersonForTest();
    const partner2 = createPersonForTest();
    let marriage: Spouse | null;

    before(async () => {
      await partner1.save();
      await partner2.save();
    });

    afterEach(async () => {
      await marriage?.destroy();
    });

    it('should divorce partner1', async () => {
      await personEventResolvers.marriage({ partner1Id: partner1.id, partner2Id: partner2.id });
      marriage = await Spouse.findOne({
        where: { partner1Id: partner1.id, partner2Id: partner2.id },
      });

      expect(await personEventResolvers.divorce(marriage?.partner1Id as string)).toBe(true);

      await marriage?.reload();
      expect(marriage?.divorce).toBeTruthy();
    });

    it('should divorce partner2', async () => {
      await personEventResolvers.marriage({ partner1Id: partner1.id, partner2Id: partner2.id });
      marriage = await Spouse.findOne({
        where: { partner1Id: partner1.id, partner2Id: partner2.id },
      });

      expect(await personEventResolvers.divorce(marriage?.partner2Id as string)).toBe(true);

      await marriage?.reload();
      expect(marriage?.divorce).toBeTruthy();
    });
  });

  describe('relocate', () => {
    const currentLocation = createLocationForTest();
    const newLocation = createLocationForTest();
    const person = createPersonForTest(currentLocation.id, currentLocation.id);

    before(async () => {
      await currentLocation.save();
      await newLocation.save();
      await person.save();
    });

    it('should change placeId for a person', async () => {
      await personEventResolvers.relocate(person.id, newLocation.id);

      await person.reload();

      expect(person.pobId).toBe(currentLocation.id);
      expect(person.placeId).toBe(newLocation.id);
    });
  });
});
