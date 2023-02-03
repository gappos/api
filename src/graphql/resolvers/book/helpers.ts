import { Book, BooksCreationAttributes } from '../../../models';

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
    await book.save();
  } catch (error) {
    console.log('ERROR {model: Book, method: save}:', (error as Error).message);
  }
  return true;
};
