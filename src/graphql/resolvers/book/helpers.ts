import { Book } from '../../../models';
import { BooksCreationAttributes } from '../../../models/book/model';

export const getBooks = async (): Promise<Book[]> => {
  try {
    return await Book.findAll();
  } catch (error) {
    throw error;
  }
};

export const addBook = async (
  bookAttributes: BooksCreationAttributes
): Promise<boolean> => {
  const book = new Book(bookAttributes);
  try {
    book.save();
    return true;
  } catch (error) {
    throw error;
  }
};
