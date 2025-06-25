import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddBookToAuthorDto {
  @ApiProperty({
    description: 'Slug of the book to add to the author',
    example: 'the-great-gatsby',
  })
  @IsNotEmpty()
  @IsString()
  bookSlug: string;
}
