import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { uuid } from 'uuidv4';
import { Author } from './entities/author.entity';
import { DatabaseService } from '@/db/database';
import { Book } from 'src/books/entities/book.entity';

@Injectable()
export class AuthorsService {
  private authors: Author[] = [];
  private books: Book[] = [];

  constructor(private readonly databaseService: DatabaseService) {
    this.authors = this.databaseService.authors;
    this.books = this.databaseService.books;
  }

  create(createAuthorDto: CreateAuthorDto) {
    // check if email already exists
    const existingAuthor = this.authors.find(
      (author) => author.email === createAuthorDto.email,
    );
    if (existingAuthor) {
      throw new NotFoundException('Author with this email already exists');
    }

    const author = {
      id: uuid(),
      ...createAuthorDto,
      books: [],
    };
    this.authors.push(author);
    return author;
  }

  findAll() {
    return this.authors;
  }

  findOne(email: string) {
    const author = this.authors.find((author) => author.email === email);
    if (!author) {
      throw new NotFoundException('Author not found');
    }
    return author;
  }

  update(email: string, updateAuthorDto: UpdateAuthorDto) {
    const author = this.authors.find((author) => author.email === email);
    if (!author) {
      throw new NotFoundException('Author not found');
    }

    // if email is being updated, check for conflicts
    if (updateAuthorDto.email && updateAuthorDto.email !== author.email) {
      const existingAuthor = this.authors.find(
        (a) => a.email === updateAuthorDto.email,
      );
      if (existingAuthor) {
        throw new NotFoundException('Author with this email already exists');
      }

      // update email references in books
      this.books.forEach((book) => {
        if (book.authors && book.authors.includes(author.email)) {
          const index = book.authors.indexOf(author.email);
          book.authors[index] = updateAuthorDto.email as string;
        }
      });
    }

    Object.assign(author, updateAuthorDto);
    return author;
  }

  remove(email: string) {
    const author = this.authors.find((author) => author.email === email);
    if (!author) {
      throw new NotFoundException('Author not found');
    }

    // check if author is associated with any books
    const authorBooks = this.books.filter(
      (book) => book.authors && book.authors.includes(author.email),
    );

    if (authorBooks.length > 0) {
      throw new ForbiddenException(
        'Cannot delete author. Author is associated with books and must be removed from all books first.',
      );
    }

    this.authors.splice(this.authors.indexOf(author), 1);
    return author;
  }

  // add a book to an author
  addBookToAuthor(email: string, bookSlug: string) {
    const author = this.findOne(email);
    const book = this.books.find((book) => book.slug === bookSlug);

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    // add book to author if not already present
    if (!author.books.includes(book.slug)) {
      author.books.push(book.slug);
    }

    // add author email to book if not already present
    if (!book.authors) {
      book.authors = [];
    }
    if (!book.authors.includes(author.email)) {
      book.authors.push(author.email);
    }

    return { author, book };
  }

  // remove a book from an author
  removeBookFromAuthor(email: string, bookSlug: string) {
    const author = this.findOne(email);
    const book = this.books.find((book) => book.slug === bookSlug);

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    // remove book from author
    author.books = author.books.filter((slug) => slug !== book.slug);

    // remove author email from book
    if (book.authors) {
      book.authors = book.authors.filter((email) => email !== author.email);
    }

    return { author, book };
  }

  // get all books by an author
  getAuthorBooks(email: string) {
    const author = this.findOne(email); // Verify author exists
    return this.books.filter((book) => book.authors?.includes(author.email));
  }
}
