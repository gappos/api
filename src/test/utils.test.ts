import expect from 'expect';

import { getName } from '../models/utils';

describe('models utils', () => {
  describe('getName()', () => {
    const firstName = 'John';
    const middleName = 'Orphan';
    const lastName = 'Doe';

    const nameWithMiddle = 'John Orphan Doe';
    const nameWithoutMiddle = 'John Doe';

    it('should return proper name with the middle name', () => {
      expect(getName(firstName, middleName, lastName)).toBe(nameWithMiddle);
    });

    it('should return proper name without the middle name', () => {
      expect(getName(firstName, undefined, lastName)).toBe(nameWithoutMiddle);
    });
  });
});
