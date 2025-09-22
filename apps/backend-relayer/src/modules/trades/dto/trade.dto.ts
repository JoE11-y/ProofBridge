import { IsOptional, IsString, IsUUID, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class QueryTradesDto {
  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'UUID of the route to filter trades by',
  })
  @IsOptional()
  @IsUUID()
  routeId?: string;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'UUID of the advertisement to filter trades by',
  })
  @IsOptional()
  @IsUUID()
  adId?: string;

  @ApiPropertyOptional({
    example: '0x1234567890abcdef',
    description: 'EVM address of the advertisement creator',
  })
  @IsOptional()
  @IsString()
  adCreatorAddress?: string;

  @ApiPropertyOptional({
    example: '0x1234567890abcdef',
    description: 'EVM address of the bridger',
  })
  @IsOptional()
  @IsString()
  bridgerAddress?: string;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'UUID of the source token',
  })
  @IsOptional()
  @IsUUID()
  fromTokenId?: string;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'UUID of the destination token',
  })
  @IsOptional()
  @IsUUID()
  toTokenId?: string;

  @ApiPropertyOptional({
    example: '1000',
    description: 'Minimum amount for filtering trades',
  })
  @IsOptional()
  @Matches(/^\d+$/)
  minAmount?: string;

  @ApiPropertyOptional({
    example: '5000',
    description: 'Maximum amount for filtering trades',
  })
  @IsOptional()
  @Matches(/^\d+$/)
  maxAmount?: string;

  @ApiPropertyOptional({
    example: 'nextPageToken',
    description: 'Pagination cursor for fetching next set of results',
  })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiPropertyOptional({
    example: 10,
    description: 'Number of results to return per page',
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  limit?: number;
}

export class CreateTradeDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'UUID of the advertisement for the trade',
  })
  @IsUUID()
  adId!: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'UUID of the route for the trade',
  })
  @IsUUID()
  routeId!: string;

  @ApiProperty({
    example: '1000',
    description: 'Amount of tokens to trade',
  })
  @Matches(/^\d+$/)
  amount!: string;

  @ApiProperty({
    example: '0x1234567890abcdef',
    description: 'Destination address for the bridger',
  })
  @IsString()
  bridgerDstAddress!: string;
}

export class AuthorizeTradeDto {
  @ApiProperty({
    example: '0x1234567890...',
    description: 'Signature for trade authorization',
  })
  @IsString()
  signature!: string;
}

export class ConfirmTradeActionDto {
  @ApiProperty({
    example: '0x1234567890abcdef',
    description: 'Transaction hash of the chain action',
  })
  @IsString()
  txHash!: string;

  @ApiPropertyOptional({
    example: '0x1234567890...',
    description: 'Optional signature for confirming the chain action',
  })
  @IsOptional()
  @IsString()
  signature?: string;
}
