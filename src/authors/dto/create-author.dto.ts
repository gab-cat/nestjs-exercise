import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAuthorDto {
  @ApiProperty({
    description: 'Author first name',
    example: 'John',
    minLength: 3,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  first_name: string;

  @ApiProperty({
    description: 'Author last name',
    example: 'Doe',
    minLength: 3,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  last_name: string;

  @ApiProperty({
    description: 'Author email address',
    example: 'john.doe@example.com',
    minLength: 3,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'Author biography',
    example: 'John Doe is a bestselling author...',
  })
  @IsOptional()
  @IsString()
  bio: string;

  @ApiPropertyOptional({
    description: 'URL to author image',
    example: 'https://example.com/images/john-doe.jpg',
  })
  @IsOptional()
  @IsString()
  image_url: string;
}
