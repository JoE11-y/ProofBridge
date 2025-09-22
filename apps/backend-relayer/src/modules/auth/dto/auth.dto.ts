import { IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ChallengeDTO {
  @ApiProperty({
    description: 'EVM address of the user',
    example: '0x1234...',
  })
  @IsString()
  @Transform(({ value }) => value.trim())
  address: string;
}

export class LoginDTO {
  @ApiProperty({
    description: 'Message to be signed',
    example: 'Login message...',
  })
  @IsString()
  @Transform(({ value }) => value.trim())
  message!: string;

  @ApiProperty({
    description: 'Signature of the message',
    example: '0x1234...',
  })
  @IsString()
  @Transform(({ value }) => value.trim())
  signature!: string;
}

export class RefreshDto {
  @ApiProperty({ description: 'Refresh token', example: 'eyJhbGciOiJIUzI1...' })
  @IsString()
  @MinLength(10)
  refresh!: string;
}
