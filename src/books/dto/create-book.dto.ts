import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsNumber,
  IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({
    description: 'Book title',
    example: 'The Great Gatsby',
    minLength: 3,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({
    description: 'Book description',
    example: 'A classic American novel about the Jazz Age...',
    minLength: 3,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  description: string;

  @ApiProperty({
    description: 'Email of the book author',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  author_email: string;

  @ApiProperty({
    description: 'URL to book cover image',
    example: 'https://example.com/covers/great-gatsby.jpg',
    minLength: 3,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  image_url: string;

  @ApiProperty({
    description: 'Book price in dollars',
    example: 19.99,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;
}
