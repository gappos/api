import { Book } from '../../../models';

export default async () => {
  return await Book.findAll();
};
