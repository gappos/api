import expect from 'expect';
import { Location, LocationCreationAttributes } from '../../models';

describe('Location model', () => {
  const locationAttributes: LocationCreationAttributes = {
    country: 'Atlantis',
    city: 'Gotham',
    place: 'Valley',
  };

  beforeEach(async () => {
    await Location.destroy({ where: {} });
  });

  after(async () => {
    await Location.destroy({ where: {} });
  });

  it('should create a new location', async () => {
    const location = await Location.create(locationAttributes);

    expect(location.id).toBeDefined();
    expect(location.country).toBe(locationAttributes.country);
    expect(location.city).toBe(locationAttributes.city);
    expect(location.place).toBe(locationAttributes.place);
  });

  it('should update an existing location', async () => {
    const location = await Location.create(locationAttributes);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore:
    await location.update({ place: null });

    const updatedLocation = await Location.findByPk(location.id);

    expect(updatedLocation?.dataValues).toEqual({
      ...locationAttributes,
      id: location.id,
      place: null,
    });
  });

  it('should delete an existing location', async () => {
    const location = await Location.create(locationAttributes);

    await location.destroy();

    const deletedLocation = await Location.findByPk(location.id);

    expect(deletedLocation).toBeFalsy();
  });
});
