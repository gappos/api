import { Arg, Query, Mutation, Resolver } from 'type-graphql';
import { Book } from '../../../models';
import { addBook, getBooks } from './helpers';

@Resolver(Book)
export class BooksResolvers {
  // @ts-ignore:
  @Query(returns => [Book])
  async books(): Promise<Book[]> {
    return await getBooks();
  }

  // @ts-ignore:
  @Mutation(returns => Boolean)
  async addBook(
    @Arg('title') title: string,
    @Arg('author') author: string
  ): Promise<boolean> {
    return await addBook({ title, author });
  }
}
