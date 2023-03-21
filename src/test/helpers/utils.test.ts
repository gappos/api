import expect from 'expect';

import { getName, getAddress } from '../../models/utils';

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

  describe('getAddress()', () => {
    const country = 'Atlantis';
    const city = 'Gotham';
    const place = 'Valley';

    const locationAll3 = 'Valley, Gotham, Atlantis';
    const locationCityCountry = 'Gotham, Atlantis';

    it('should return proper address: place, city, country', () => {
      expect(getAddress(place, city, country)).toBe(locationAll3);
    });

    it('should return proper address without place: city, country', () => {
      expect(getAddress(undefined, city, country)).toBe(locationCityCountry);
    });
  });
});
