import { Injectable } from '@nestjs/common';
import { Author } from 'src/authors/entities/author.entity';
import { Book } from 'src/books/entities/book.entity';

@Injectable()
export class DatabaseService {
  authors: Author[] = [];
  books: Book[] = [];
}
