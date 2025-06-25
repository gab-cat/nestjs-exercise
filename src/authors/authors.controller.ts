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
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { AddBookToAuthorDto } from './dto/add-book-to-author.dto';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';

@ApiTags('authors')
@Controller('authors')
@UseFilters(HttpExceptionFilter)
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new author' })
  @ApiBody({ type: CreateAuthorDto })
  @ApiResponse({ status: 201, description: 'Author created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorsService.create(createAuthorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all authors' })
  @ApiResponse({ status: 200, description: 'List of all authors' })
  findAll() {
    return this.authorsService.findAll();
  }

  @Get(':email')
  @ApiOperation({ summary: 'Get author by email' })
  @ApiParam({ name: 'email', description: 'Author email' })
  @ApiResponse({ status: 200, description: 'Author found' })
  @ApiResponse({ status: 404, description: 'Author not found' })
  findOne(@Param('email') email: string) {
    return this.authorsService.findOne(email);
  }

  @Patch(':email')
  @ApiOperation({ summary: 'Update author by email' })
  @ApiParam({ name: 'email', description: 'Author email' })
  @ApiBody({ type: UpdateAuthorDto })
  @ApiResponse({ status: 200, description: 'Author updated successfully' })
  @ApiResponse({ status: 404, description: 'Author not found' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  update(
    @Param('email') email: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ) {
    return this.authorsService.update(email, updateAuthorDto);
  }

  @Delete(':email')
  @ApiOperation({ summary: 'Delete author by email' })
  @ApiParam({ name: 'email', description: 'Author email' })
  @ApiResponse({ status: 200, description: 'Author deleted successfully' })
  @ApiResponse({ status: 404, description: 'Author not found' })
  remove(@Param('email') email: string) {
    return this.authorsService.remove(email);
  }

  @Get(':email/books')
  @ApiOperation({ summary: 'Get all books by author' })
  @ApiParam({ name: 'email', description: 'Author email' })
  @ApiResponse({ status: 200, description: 'List of books by author' })
  @ApiResponse({ status: 404, description: 'Author not found' })
  getAuthorBooks(@Param('email') email: string) {
    return this.authorsService.getAuthorBooks(email);
  }

  @Post(':email/books')
  @ApiOperation({ summary: 'Add a book to an author' })
  @ApiParam({ name: 'email', description: 'Author email' })
  @ApiBody({ type: AddBookToAuthorDto })
  @ApiResponse({
    status: 201,
    description: 'Book added to author successfully',
  })
  @ApiResponse({ status: 404, description: 'Author or book not found' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  addBookToAuthor(
    @Param('email') authorEmail: string,
    @Body() addBookToAuthorDto: AddBookToAuthorDto,
  ) {
    return this.authorsService.addBookToAuthor(
      authorEmail,
      addBookToAuthorDto.bookSlug,
    );
  }

  @Delete(':email/books/:bookSlug')
  @ApiOperation({ summary: 'Remove a book from an author' })
  @ApiParam({ name: 'email', description: 'Author email' })
  @ApiParam({ name: 'bookSlug', description: 'Book slug' })
  @ApiResponse({
    status: 200,
    description: 'Book removed from author successfully',
  })
  @ApiResponse({ status: 404, description: 'Author or book not found' })
  removeBookFromAuthor(
    @Param('email') authorEmail: string,
    @Param('bookSlug') bookSlug: string,
  ) {
    return this.authorsService.removeBookFromAuthor(authorEmail, bookSlug);
  }
}
