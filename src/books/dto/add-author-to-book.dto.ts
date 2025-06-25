import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddAuthorToBookDto {
  @ApiProperty({
    description: 'Email of the author to add to the book',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  authorEmail: string;
}
