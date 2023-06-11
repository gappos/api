import expect from 'expect';
import captureStream from 'capture-stream';

import { SpouseInput, SpouseResolvers } from '../../../graphql';
import { clearDB, createPersonForTest } from '../../utils/utils';
import { dsSpouseInput } from '../../../deserialize';
import { Spouse } from '../../../models';

describe('SpouseResolvers', () => {
  const spouseResolver = new SpouseResolvers();
  const personPartner1 = createPersonForTest();
  const personPartner2 = createPersonForTest();
  const spouseInput: SpouseInput = {
    partner1Id: personPartner1.id,
    partner2Id: personPartner2.id,
    wedding: '2000-02-20',
    divorce: '2020-02-02',
  };
  let spouseRelation: Spouse | null;

  before(async () => {
    await personPartner1.save();
    await personPartner2.save();
    spouseRelation = await spouseResolver.addSpouse(spouseInput);
  });

  after(async () => {
    await clearDB();
  });

  describe('addSpouse', () => {
    it('should create spouse relation with wedding and divorce dates', async () => {
      expect(spouseRelation?.dataValues).toEqual(dsSpouseInput(spouseInput));
    });

    it('should not create spouse relation for the same couple', async () => {
      const spouseInput2: SpouseInput = {
        partner1Id: personPartner1.id,
        partner2Id: personPartner2.id,
        wedding: '2000-02-20',
      };

      const outputStream = captureStream(process.stderr);

      expect(await spouseResolver.addSpouse(spouseInput2)).toBeFalsy();
      expect(outputStream(true)).toContain('Validation error');
    });
  });

  describe('updateSpouse', () => {
    it('should update spouse relation', async () => {
      const spouseUpdateInput: SpouseInput = {
        partner1Id: personPartner1.id,
        partner2Id: personPartner2.id,
        divorce: '2022-02-02',
      };

      const updatedSpouse = await spouseResolver.updateSpouse(spouseUpdateInput);
      expect(updatedSpouse?.divorce).toEqual(new Date('2022-02-02'));
    });
  });
});
