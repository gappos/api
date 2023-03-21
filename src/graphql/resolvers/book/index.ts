import { Arg, Query, Mutation, Resolver } from 'type-graphql';
import { Book } from '../../../models';
import { addBook, getBooks } from './helpers';

@Resolver(Book)
export class BooksResolvers {
  @Query(() => [Book])
  async books(): Promise<Book[]> {
    return await getBooks();
  }

  @Mutation(() => Boolean)
  async addBook(@Arg('title') title: string, @Arg('author') author: string): Promise<boolean> {
    return await addBook({ title, author });
  }
}
