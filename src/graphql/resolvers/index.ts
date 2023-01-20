import books from './book';

export default {
  Query: { books },
  Mutation: {
    addBook(book) {
      console.log(book);
    }
  }
};
