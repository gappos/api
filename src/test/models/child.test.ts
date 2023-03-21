import expect from 'expect';

import { Child, ParentRelation, Person } from '../../models';
import { createPersonForTest } from '../utils/utils';

describe('Child model', () => {
  let personChild: Person;
  let personMother: Person;

  before(async () => {
    personChild = await createPersonForTest().save();
    personMother = await createPersonForTest().save();
  });

  after(async () => {
    await Person.destroy({ where: {} });
  });

  afterEach(async () => {
    await Child.destroy({ where: {} });
  });

  it('should create a new child', async () => {
    const child = await Child.create({
      childId: personChild.id,
      parentId: personMother.id,
      relation: ParentRelation.MOTHER,
    });

    expect(child.childId).toBe(personChild.id);
    expect(child.parentId).toBe(personMother.id);
    expect(child.relation).toBe(ParentRelation.MOTHER);
  });

  it('should update child', async () => {
    const child = await Child.create({
      childId: personChild.id,
      parentId: personMother.id,
      relation: ParentRelation.MOTHER,
    });

    await child.update({ relation: ParentRelation.PARENT });
    const updatedChild = await Child.findOne({
      where: { childId: personChild.id, parentId: personMother.id },
    });

    expect(updatedChild).toBeTruthy();
    expect(updatedChild?.relation).toBe(ParentRelation.PARENT);
  });

  it('should delete child', async () => {
    const child = await Child.create({
      childId: personChild.id,
      parentId: personMother.id,
      relation: ParentRelation.MOTHER,
    });

    await child.destroy();
    const deletedChild = await Child.findOne({
      where: { childId: personChild.id, parentId: personMother.id },
    });
    expect(deletedChild).toBeFalsy();
  });
});
