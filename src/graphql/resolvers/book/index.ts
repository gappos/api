import { Query, Resolver } from 'type-graphql';
import { Book } from '../../../models';
import getBooks from './getBooks';

@Resolver(Book)
export class BooksResolver {
  // @ts-ignore:
  @Query(returns => [Book])
  async books(): Promise<Book[]> {
    return await getBooks();
  }
}
