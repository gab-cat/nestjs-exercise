import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AddAuthorToBookDto } from './dto/add-author-to-book.dto';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';

@ApiTags('books')
@Controller('books')
@UseFilters(HttpExceptionFilter)
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new book' })
  @ApiBody({ type: CreateBookDto })
  @ApiResponse({ status: 201, description: 'Book created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all books' })
  @ApiResponse({ status: 200, description: 'List of all books' })
  findAll() {
    return this.booksService.findAll();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get book by slug' })
  @ApiParam({ name: 'slug', description: 'Book slug' })
  @ApiResponse({ status: 200, description: 'Book found' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  findOne(@Param('slug') slug: string) {
    return this.booksService.findOne(slug);
  }

  @Patch(':slug')
  @ApiOperation({ summary: 'Update book by slug' })
  @ApiParam({ name: 'slug', description: 'Book slug' })
  @ApiBody({ type: UpdateBookDto })
  @ApiResponse({ status: 200, description: 'Book updated successfully' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  update(@Param('slug') slug: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(slug, updateBookDto);
  }

  @Delete(':slug')
  @ApiOperation({ summary: 'Delete book by slug' })
  @ApiParam({ name: 'slug', description: 'Book slug' })
  @ApiResponse({ status: 200, description: 'Book deleted successfully' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  remove(@Param('slug') slug: string) {
    return this.booksService.remove(slug);
  }

  @Get(':slug/authors')
  @ApiOperation({ summary: 'Get all authors of a book' })
  @ApiParam({ name: 'slug', description: 'Book slug' })
  @ApiResponse({ status: 200, description: 'List of authors for the book' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  getBookAuthors(@Param('slug') slug: string) {
    return this.booksService.getBookAuthors(slug);
  }

  @Post(':slug/authors')
  @ApiOperation({ summary: 'Add an author to a book' })
  @ApiParam({ name: 'slug', description: 'Book slug' })
  @ApiBody({ type: AddAuthorToBookDto })
  @ApiResponse({
    status: 201,
    description: 'Author added to book successfully',
  })
  @ApiResponse({ status: 404, description: 'Book or author not found' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  addAuthorToBook(
    @Param('slug') bookSlug: string,
    @Body() addAuthorToBookDto: AddAuthorToBookDto,
  ) {
    return this.booksService.addAuthorToBook(
      bookSlug,
      addAuthorToBookDto.authorEmail,
    );
  }

  @Delete(':slug/authors/:authorEmail')
  @ApiOperation({ summary: 'Remove an author from a book' })
  @ApiParam({ name: 'slug', description: 'Book slug' })
  @ApiParam({ name: 'authorEmail', description: 'Author Email' })
  @ApiResponse({
    status: 200,
    description: 'Author removed from book successfully',
  })
  @ApiResponse({ status: 404, description: 'Book or author not found' })
  removeAuthorFromBook(
    @Param('slug') bookSlug: string,
    @Param('authorEmail') authorEmail: string,
  ) {
    return this.booksService.removeAuthorFromBook(bookSlug, authorEmail);
  }
}
