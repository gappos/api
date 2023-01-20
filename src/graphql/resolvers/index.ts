import { BookInput } from '../__generated__/resolvers-types';
import books from './book';

export default {
  Query: { books },
  Mutation: {
    addBook(book: BookInput): boolean {
      return true;
    }
  }
};
