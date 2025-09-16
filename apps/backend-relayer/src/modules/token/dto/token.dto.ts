import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { TokenKind } from '@prisma/client';

export class QueryTokensDto {
  // Filter by chain uuid
  @IsOptional()
  @IsUUID()
  chainUid?: string;

  // Filter by chain id
  @IsOptional()
  @IsUUID()
  chainId?: string;

  @IsOptional()
  @IsString()
  symbol?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 25;
}

export class CreateTokenDto {
  @IsUUID()
  chainUid!: string; // internal chain UUID

  @IsString()
  @IsNotEmpty()
  symbol!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  address!: string; // we’ll lowercase

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(255)
  decimals!: number;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsEnum(TokenKind, {
    message: `kind must be one of: ${Object.values(TokenKind).join(', ')}`,
  })
  kind?: TokenKind;
}

export class UpdateTokenDto {
  @IsOptional()
  @IsUUID()
  chainUid?: string;

  @IsOptional()
  @IsString()
  symbol?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(255)
  decimals?: number;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsEnum(TokenKind, {
    message: `kind must be one of: ${Object.values(TokenKind).join(', ')}`,
  })
  kind?: TokenKind;
}
