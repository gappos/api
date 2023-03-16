import { expect } from 'expect';
import { SinonStub, stub } from 'sinon';
import { Book } from '../../../models';
import { BooksResolvers } from '../../../graphql';

describe('BooksResolvers', () => {
  let resolver: BooksResolvers;
  let findAllStub: SinonStub;

  beforeEach(() => {
    // Create a new instance of the resolver before each test
    resolver = new BooksResolvers();

    // Create a stub for the findAll method of the User model
    findAllStub = stub(Book, 'findAll');
  });

  afterEach(() => {
    // Restore the stubbed methods after each test
    findAllStub.restore();
  });

  it('should return an array of books', async () => {
    // Arrange
    const expectedBooks = [
      { id: 1, title: 'Nothing', author: 'Nobody' },
      { id: 2, title: 'Something', author: 'Somebody' },
    ];
    findAllStub.resolves(expectedBooks);

    // Act
    const actualBooks = await resolver.books();

    // Assert
    expect(actualBooks).toEqual(expectedBooks);
  });
});
