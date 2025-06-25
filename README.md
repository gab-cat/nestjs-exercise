# NestJS Exercise

This is a **Bookstore API** built with NestJS featuring a many-to-many relationship between Authors and Books.

## Features

- **Books Management**: Create, read, update, and delete books using slug-based URLs
- **Authors Management**: Manage authors using email-based identification
- **Many-to-Many Relationships**: Authors can have multiple books, and books can have multiple authors
- **Swagger Documentation**: Interactive API documentation available at `/api`
- **Input Validation**: Comprehensive validation using class-validator
- **Error Handling**: Global exception filtering for consistent error responses

## API Endpoints

### 📚 Books API

| Method   | Endpoint        | Description         | Request Body                    | Parameters                                   |
| -------- | --------------- | ------------------- | ------------------------------- | -------------------------------------------- |
| `GET`    | `/books`        | Get all books       | -                               | -                                            |
| `POST`   | `/books`        | Create a new book   | [CreateBookDto](#createbookdto) | -                                            |
| `GET`    | `/books/{slug}` | Get book by slug    | -                               | `slug`: Book slug (e.g., `the-great-gatsby`) |
| `PATCH`  | `/books/{slug}` | Update book by slug | [UpdateBookDto](#updatebookdto) | `slug`: Book slug                            |
| `DELETE` | `/books/{slug}` | Delete book by slug | -                               | `slug`: Book slug                            |

### 👥 Book-Author Relationships

| Method   | Endpoint                        | Description               | Request Body                              | Parameters                                 |
| -------- | ------------------------------- | ------------------------- | ----------------------------------------- | ------------------------------------------ |
| `GET`    | `/books/{slug}/authors`         | Get all authors of a book | -                                         | `slug`: Book slug                          |
| `POST`   | `/books/{slug}/authors`         | Add author to book        | [AddAuthorToBookDto](#addauthortobookdto) | `slug`: Book slug                          |
| `DELETE` | `/books/{slug}/authors/{email}` | Remove author from book   | -                                         | `slug`: Book slug<br>`email`: Author email |

### 👤 Authors API

| Method   | Endpoint           | Description            | Request Body                        | Parameters                          |
| -------- | ------------------ | ---------------------- | ----------------------------------- | ----------------------------------- |
| `GET`    | `/authors`         | Get all authors        | -                                   | -                                   |
| `POST`   | `/authors`         | Create a new author    | [CreateAuthorDto](#createauthordto) | -                                   |
| `GET`    | `/authors/{email}` | Get author by email    | -                                   | `email`: Author email (URL encoded) |
| `PATCH`  | `/authors/{email}` | Update author by email | [UpdateAuthorDto](#updateauthordto) | `email`: Author email (URL encoded) |
| `DELETE` | `/authors/{email}` | Delete author by email | -                                   | `email`: Author email (URL encoded) |

### 📖 Author-Book Relationships

| Method   | Endpoint                        | Description             | Request Body                              | Parameters                                               |
| -------- | ------------------------------- | ----------------------- | ----------------------------------------- | -------------------------------------------------------- |
| `GET`    | `/authors/{email}/books`        | Get all books by author | -                                         | `email`: Author email (URL encoded)                      |
| `POST`   | `/authors/{email}/books`        | Add book to author      | [AddBookToAuthorDto](#addbooktoauthordto) | `email`: Author email (URL encoded)                      |
| `DELETE` | `/authors/{email}/books/{slug}` | Remove book from author | -                                         | `email`: Author email (URL encoded)<br>`slug`: Book slug |

## Data Transfer Objects (DTOs)

### CreateBookDto

```json
{
  "title": "The Great Gatsby",
  "description": "A classic American novel about the Jazz Age...",
  "author_email": "john.doe@example.com",
  "image_url": "https://example.com/covers/great-gatsby.jpg",
  "price": 19.99
}
```

### UpdateBookDto

All fields from `CreateBookDto` are optional for updates.

### CreateAuthorDto

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "bio": "John Doe is a bestselling author...",
  "image_url": "https://example.com/images/john-doe.jpg"
}
```

### UpdateAuthorDto

All fields from `CreateAuthorDto` are optional for updates.

### AddAuthorToBookDto

```json
{
  "authorEmail": "john.doe@example.com"
}
```

### AddBookToAuthorDto

```json
{
  "bookSlug": "the-great-gatsby"
}
```

## Response Examples

### Book Response

```json
{
  "id": "uuid-here",
  "slug": "the-great-gatsby",
  "title": "The Great Gatsby",
  "description": "A classic American novel...",
  "authors": ["john.doe@example.com"],
  "image_url": "https://example.com/covers/great-gatsby.jpg",
  "price": 19.99
}
```

### Author Response

```json
{
  "id": "uuid-here",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "bio": "John Doe is a bestselling author...",
  "image_url": "https://example.com/images/john-doe.jpg",
  "books": ["book-uuid-1", "book-uuid-2"]
}
```

## Key Features

- **Slug-based Book URLs**: Books use SEO-friendly slugs generated from titles
- **Email-based Author URLs**: Authors are identified by their email addresses
- **Automatic Slug Generation**: Book slugs are automatically created and kept unique
- **Relationship Management**: Bidirectional relationship updates between authors and books
- **Comprehensive Validation**: All inputs are validated using decorators
- **Swagger Integration**: Full API documentation available at `/api`

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## API Documentation

Once the server is running, visit `http://localhost:3000/api` to access the interactive Swagger documentation.
