import {
  IsInt,
  IsOptional,
  IsUUID,
  Max,
  Min,
  IsString,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QueryRoutesDto {
  @ApiProperty({
    description: 'Source token UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  fromTokenId?: string;

  @ApiProperty({
    description: 'Destination token UUID',
    example: '123e4567-e89b-12d3-a456-426614174001',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  toTokenId?: string;

  @ApiProperty({
    description: 'Source chain ID',
    example: '1',
    required: false,
  })
  @IsOptional()
  @Matches(/^\d+$/)
  fromChainId?: string;

  @ApiProperty({
    description: 'Destination chain ID',
    example: '137',
    required: false,
  })
  @IsOptional()
  @Matches(/^\d+$/)
  toChainId?: string;

  @ApiProperty({
    description: 'Token symbol',
    example: 'ETH',
    required: false,
  })
  @IsOptional()
  @IsString()
  symbol?: string;

  @ApiProperty({
    description: 'Pagination cursor',
    example: 'next_page_token',
    required: false,
  })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiProperty({
    description: 'Number of items per page',
    example: 25,
    default: 25,
    minimum: 1,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 25;
}

export class CreateRouteDto {
  @ApiProperty({
    description: 'Source token UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  fromTokenId!: string;

  @ApiProperty({
    description: 'Destination token UUID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  toTokenId!: string;

  @ApiProperty({
    description: 'Additional metadata for the route',
    example: { fee: 0.1, slippage: 0.5 },
    required: false,
  })
  @IsOptional()
  metadata?: object;
}
