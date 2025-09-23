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

export class ChallengeResponseDto {
  @ApiProperty({
    description: 'Unique nonce for the challenge',
    example: '123456789',
  })
  @IsString()
  nonce: string;

  @ApiProperty({
    description: 'EVM address of the user',
    example: '0x1234...',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Expiration timestamp',
    example: '2024-01-01T00:00:00Z',
  })
  @IsString()
  expiresAt: string;

  @ApiProperty({
    description: 'Domain for the challenge',
    example: 'example.com',
  })
  @IsString()
  domain: string;

  @ApiProperty({
    description: 'URI for the challenge',
    example: 'https://example.com/auth',
  })
  @IsString()
  uri: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'User information',
    example: {
      id: '123',
      username: 'user123',
    },
  })
  user: {
    id: string;
    username: string;
  };

  @ApiProperty({
    description: 'Authentication tokens',
    example: {
      access: 'eyJhbGciOiJIUzI1...',
      refresh: 'eyJhbGciOiJIUzI1...',
    },
  })
  tokens: {
    access: string;
    refresh: string;
  };
}

export class RefreshResponseDto {
  @ApiProperty({
    description: 'Authentication tokens',
    example: {
      access: 'eyJhbGciOiJIUzI1...',
      refresh: 'eyJhbGciOiJIUzI1...',
    },
  })
  tokens: {
    access: string;
    refresh: string;
  };
}
