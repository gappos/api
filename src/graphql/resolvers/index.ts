import { BookInput } from '../__generated__/resolvers-types';
import books from './book';

export default {
  Query: { books },
  Mutation: {
    addBook(_book: BookInput): boolean {
      return true;
    }
  }
};
