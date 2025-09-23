import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
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
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
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

export class UnlockTradeDto {
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

export class ChainDto {
  @ApiProperty({ example: 'Ethereum' })
  name!: string;
}

export class TokenDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id!: string;

  @ApiProperty({ example: 'ETH' })
  symbol!: string;

  @ApiProperty()
  chain!: ChainDto;
}

export class RouteDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id!: string;

  @ApiProperty()
  fromToken!: TokenDto;

  @ApiProperty()
  toToken!: TokenDto;
}

export class AdDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id!: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  routeId!: string;

  @ApiProperty({ example: '0x1234567890abcdef' })
  creatorAddress!: string;
}

export class TradeResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id!: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  routeId!: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  adId!: string;

  @ApiProperty({ example: '0x1234567890abcdef' })
  adCreatorAddress!: string;

  @ApiProperty({ example: '0x1234567890abcdef' })
  bridgerAddress!: string;

  @ApiProperty({ example: '1000' })
  amount!: string;

  @ApiProperty({ example: 'PENDING' })
  status!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty()
  ad!: AdDto;

  @ApiProperty()
  route!: RouteDto;
}

export class ListTradesResponseDto {
  @ApiProperty({ type: [TradeResponseDto] })
  data!: TradeResponseDto[];

  @ApiProperty({ example: 'nextPageToken', nullable: true })
  nextCursor!: string | null;
}

export class LockForOrderResponseDto {
  @ApiProperty({
    example: '0x1234567890abcdef',
    description: 'Contract address',
  })
  @IsString()
  contractAddress!: string;

  @ApiProperty({
    example: '0x1234567890abcdef...',
    description: 'Signature value',
  })
  @IsString()
  signature!: string;

  @ApiProperty({
    example: 'token123',
    description: 'Authentication token',
  })
  @IsString()
  authToken!: string;

  @ApiProperty({
    example: 3600,
    description: 'Time until request expires in seconds',
  })
  @IsInt()
  timeToExpire!: number;

  @ApiProperty({
    example: '0x1234567890abcdef...',
    description: 'Request hash',
  })
  @IsString()
  reqHash!: string;

  @ApiProperty({
    example: '0x1234567890abcdef...',
    description: 'Order hash',
  })
  @IsString()
  orderHash!: string;
}

export class CreateOrderRequestContractDetailsDto {
  @ApiProperty({
    example: '0x1234567890abcdef',
    description: 'Contract address',
  })
  @IsString()
  contractAddress!: string;

  @ApiProperty({
    example: '0x1234567890abcdef...',
    description: 'Signature value',
  })
  @IsString()
  signature!: `0x${string}`;

  @ApiProperty({
    example: 'token123',
    description: 'Authentication token',
  })
  @IsString()
  authToken!: string;

  @ApiProperty({
    example: 3600,
    description: 'Time until expiration in seconds',
  })
  @IsInt()
  timeToExpire!: number;

  @ApiProperty({
    description: 'Order portal parameters',
  })
  orderParams!: any;

  @ApiProperty({
    example: '0x1234567890abcdef...',
    description: 'Order hash',
  })
  @IsString()
  orderHash!: `0x${string}`;

  @ApiProperty({
    example: '0x1234567890abcdef...',
    description: 'Request hash',
  })
  @IsString()
  reqHash!: `0x${string}`;
}

export class CreateTradeRequestContractResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Trade ID',
  })
  @IsUUID()
  tradeId!: string;

  @ApiProperty({
    description: 'Contract request details',
  })
  reqContractDetails!: CreateOrderRequestContractDetailsDto;
}

export class UnlockOrderResponseDto {
  @ApiProperty({
    example: '0x1234567890abcdef',
    description: 'Contract address',
  })
  @IsString()
  contractAddress!: `0x${string}`;

  @ApiProperty({
    example: '0x1234567890abcdef...',
    description: 'Signature value',
  })
  @IsString()
  signature!: `0x${string}`;

  @ApiProperty({
    example: 'token123',
    description: 'Authentication token',
  })
  @IsString()
  authToken!: string;

  @ApiProperty({
    example: 3600,
    description: 'Time until expiration in seconds',
  })
  @IsInt()
  timeToExpire!: number;

  @ApiProperty({
    description: 'Order parameters',
  })
  orderParams!: any;

  @ApiProperty({
    example: '0x1234567890abcdef...',
    description: 'Nullifier hash',
  })
  @IsString()
  nullifierHash!: string;

  @ApiProperty({
    example: '0x1234567890abcdef...',
    description: 'Target root',
  })
  @IsString()
  targetRoot!: string;

  @ApiProperty({
    example: '0x1234567890abcdef...',
    description: 'Proof value',
  })
  @IsString()
  proof!: string;

  @ApiProperty({
    example: '0x1234567890abcdef...',
    description: 'Order hash',
  })
  @IsString()
  orderHash!: `0x${string}`;

  @ApiProperty({
    example: '0x1234567890abcdef...',
    description: 'Request hash',
  })
  @IsString()
  reqHash!: `0x${string}`;
}

export class ConfirmChainActionResponseDto {
  @ApiProperty({
    description: 'Whether the chain action was confirmed successfully',
    example: true,
  })
  success!: boolean;
}
