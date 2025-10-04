import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminAuthDTO {
  @ApiProperty({
    description: 'The email address of the admin',
    example: 'admin@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'The password for the admin account',
    example: 'password123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password!: string;
}
