import expect from 'expect';

import { Spouse, Person } from '../../models';
import { createPersonForTest } from '../utils/utils';

describe('Spouse model', () => {
  let person1: Person;
  let person2: Person;

  before(async () => {
    person1 = await createPersonForTest().save();
    person2 = await createPersonForTest().save();
  });

  after(async () => {
    await Person.destroy({ where: {} });
  });

  afterEach(async () => {
    await Spouse.destroy({ where: {} });
  });

  it('should create a new couple', async () => {
    const wedding = new Date();
    const divorce = new Date();
    const spouse = await Spouse.create({
      partner1Id: person1.id,
      partner2Id: person2.id,
      wedding,
      divorce,
    });

    expect(spouse.partner1Id).toBe(person1.id);
    expect(spouse.partner2Id).toBe(person2.id);
    expect(spouse.wedding).toStrictEqual(wedding);
    expect(spouse.divorce).toStrictEqual(divorce);
  });

  it('should update spouse', async () => {
    const wedding = new Date();
    const divorce = new Date();
    const spouse = await Spouse.create({
      partner1Id: person1.id,
      partner2Id: person2.id,
      wedding,
    });

    await spouse.update({ divorce });
    const updatedChild = await Spouse.findOne({
      where: { partner1Id: person1.id, partner2Id: person2.id },
    });

    expect(updatedChild).toBeTruthy();
    expect(updatedChild?.divorce).toStrictEqual(divorce);
  });

  it('should delete child', async () => {
    const spouse = await Spouse.create({
      partner1Id: person1.id,
      partner2Id: person2.id,
      wedding: new Date(),
    });

    await spouse.destroy();
    const deletedSpouse = await Spouse.findOne({
      where: { partner1Id: person1.id, partner2Id: person2.id },
    });
    expect(deletedSpouse).toBeFalsy();
  });
});
