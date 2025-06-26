import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { uuid } from 'uuidv4';
import { DatabaseService } from '@/db/database';
import { Author } from 'src/authors/entities/author.entity';
import { Book } from 'src/books/entities/book.entity';

@Injectable()
export class BooksService {
  constructor(private readonly databaseService: DatabaseService) {}

  get books(): Book[] {
    return this.databaseService.books;
  }

  get authors(): Author[] {
    return this.databaseService.authors;
  }

  create(createBookDto: CreateBookDto) {
    // check if the author exists
    const author = this.authors.find(
      (a) => a.email === createBookDto.author_email,
    );
    if (!author) {
      throw new NotFoundException('Author not found');
    }

    const baseSlug = this.generateSlug(createBookDto.title);
    const uniqueSlug = this.ensureUniqueSlug(baseSlug);

    const book = {
      id: uuid(),
      slug: uniqueSlug,
      ...createBookDto,
      authors: createBookDto.author_email ? [createBookDto.author_email] : [],
    };
    this.books.push(book);

    // update the author's books array if author_email is provided
    if (createBookDto.author_email) {
      const author = this.authors.find(
        (a) => a.email === createBookDto.author_email,
      );
      if (author) {
        if (!author.books) {
          author.books = [];
        }
        if (!author.books.includes(book.slug)) {
          author.books.push(book.slug);
        }
      }
    }

    return book;
  }

  findAll() {
    return this.books;
  }

  findOne(slug: string) {
    const book = this.books.find((book) => book.slug === slug);
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  update(slug: string, updateBookDto: UpdateBookDto) {
    const book = this.books.find((book) => book.slug === slug);
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    // if title is being updated, regenerate slug
    if (updateBookDto.title && updateBookDto.title !== book.title) {
      const baseSlug = this.generateSlug(updateBookDto.title);
      const uniqueSlug = this.ensureUniqueSlug(baseSlug);
      book.slug = uniqueSlug;
    }

    Object.assign(book, updateBookDto);
    return book;
  }

  remove(slug: string) {
    const book = this.books.find((book) => book.slug === slug);
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    // remove book from all authors
    this.authors.forEach((author) => {
      if (author.books && author.books.includes(book.slug)) {
        author.books = author.books.filter(
          (bookSlug) => bookSlug !== book.slug,
        );
      }
    });

    this.books.splice(this.books.indexOf(book), 1);
    return book;
  }

  // add an author to a book
  addAuthorToBook(slug: string, authorEmail: string) {
    const book = this.findOne(slug);
    const author = this.authors.find((author) => author.email === authorEmail);

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    // add author email to book if not already present
    if (!book.authors) {
      book.authors = [];
    }
    if (!book.authors.includes(authorEmail)) {
      book.authors.push(authorEmail);
    }

    // add book to author if not already present
    if (!author.books) {
      author.books = [];
    }
    if (!author.books.includes(book.slug)) {
      author.books.push(book.slug);
    }

    return { book, author };
  }

  // remove an author from a book
  removeAuthorFromBook(slug: string, authorEmail: string) {
    const book = this.findOne(slug);
    const author = this.authors.find((author) => author.email === authorEmail);

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    // remove author email from book
    if (book.authors) {
      book.authors = book.authors.filter((email) => email !== authorEmail);
    }

    // remove book from author
    if (author.books) {
      author.books = author.books.filter((slug) => slug !== book.slug);
    }

    return { book, author };
  }

  // get all authors of a book
  getBookAuthors(slug: string) {
    const book = this.findOne(slug);
    const bookAuthors = this.authors.filter((author) =>
      book.authors?.includes(author.email),
    );
    return bookAuthors;
  }

  // helper function to generate slug from title
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // helper function to ensure unique slug
  private ensureUniqueSlug(baseSlug: string): string {
    let slug = baseSlug;
    let counter = 1;

    while (this.databaseService.books.some((book) => book.slug === slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }
}
