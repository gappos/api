import { SpouseInput } from '../graphql';
import { SpouseAttributes } from '../models';

export const dsSpouseInput = (spouseInput: SpouseInput): SpouseAttributes => ({
  ...(spouseInput as unknown as SpouseAttributes),
  ...(spouseInput.wedding ? { wedding: new Date(spouseInput.wedding) } : {}),
  ...(spouseInput.divorce ? { divorce: new Date(spouseInput.divorce) } : {}),
});
