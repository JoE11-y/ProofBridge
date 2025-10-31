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
  adTokenId?: string;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'UUID of the destination token',
  })
  @IsOptional()
  @IsUUID()
  orderTokenId?: string;

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

  @ApiProperty({ example: '1' })
  chainId!: string;
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
  adToken!: TokenDto;

  @ApiProperty()
  orderToken!: TokenDto;
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

  @ApiProperty({ example: '1' })
  adChainId!: string;

  @ApiProperty({ example: '294' })
  orderChainId!: string;

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

export class AdManagerOrderParamsDto {
  @ApiProperty({
    example: '0x1234567890abcdef',
    description: 'Order chain token address',
  })
  @IsString()
  orderChainToken!: string;

  @ApiProperty({
    example: '0x1234567890abcdef',
    description: 'Ad chain token address',
  })
  @IsString()
  adChainToken!: string;

  @ApiProperty({
    example: '1000',
    description: 'Amount of tokens',
  })
  @IsString()
  amount!: string;

  @ApiProperty({
    example: '0x1234567890abcdef',
    description: 'Bridger address',
  })
  @IsString()
  bridger!: string;

  @ApiProperty({
    example: '1',
    description: 'Order chain ID',
  })
  @IsString()
  orderChainId!: string;

  @ApiProperty({
    example: '0x1234567890abcdef',
    description: 'Order portal address',
  })
  @IsString()
  srcOrderPortal!: string;

  @ApiProperty({
    example: '0x1234567890abcdef',
    description: 'Order recipient address',
  })
  @IsString()
  orderRecipient!: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Advertisement ID',
  })
  @IsString()
  adId!: string;

  @ApiProperty({
    example: '0x1234567890abcdef',
    description: 'Ad creator address',
  })
  @IsString()
  adCreator!: string;

  @ApiProperty({
    example: '0x1234567890abcdef',
    description: 'Ad recipient address',
  })
  @IsString()
  adRecipient!: string;

  @ApiProperty({
    example: '123456',
    description: 'Salt value',
  })
  @IsString()
  salt!: string;
}

export class LockForOrderResponseDto {
  @ApiProperty({
    description: 'Blockchain chain ID where the ad contract is deployed',
    example: '1',
  })
  chainId!: string;

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
    description: 'AdManager order parameters',
  })
  orderParams!: AdManagerOrderParamsDto;

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

export class OrderPortalParamsDto {
  @ApiProperty({
    example: '0x1234567890abcdef',
    description: 'Order chain token address',
  })
  @IsString()
  orderChainToken!: string;

  @ApiProperty({
    example: '0x1234567890abcdef',
    description: 'Ad chain token address',
  })
  @IsString()
  adChainToken!: string;

  @ApiProperty({
    example: '1000',
    description: 'Amount of tokens',
  })
  @IsString()
  amount!: string;

  @ApiProperty({
    example: '0x1234567890abcdef',
    description: 'Bridger address',
  })
  @IsString()
  bridger!: string;

  @ApiProperty({
    example: '0x1234567890abcdef',
    description: 'Order recipient address',
  })
  @IsString()
  orderRecipient!: string;

  @ApiProperty({
    example: '1',
    description: 'Ad chain ID',
  })
  @IsString()
  adChainId!: string;

  @ApiProperty({
    example: '0x1234567890abcdef',
    description: 'Ad manager address',
  })
  @IsString()
  adManager!: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Advertisement ID',
  })
  @IsString()
  adId!: string;

  @ApiProperty({
    example: '0x1234567890abcdef',
    description: 'Ad creator address',
  })
  @IsString()
  adCreator!: string;

  @ApiProperty({
    example: '0x1234567890abcdef',
    description: 'Ad recipient address',
  })
  @IsString()
  adRecipient!: string;

  @ApiProperty({
    example: '123456',
    description: 'Salt value',
  })
  @IsString()
  salt!: string;
}

export class CreateOrderRequestContractDetailsDto {
  @ApiProperty({
    description: 'Blockchain chain ID where the order contract is deployed',
    example: '1',
  })
  chainId!: string;

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
  orderParams!: OrderPortalParamsDto;

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
    description: 'Blockchain chain ID where the order/ad contract is deployed',
    example: '1',
  })
  chainId!: string;

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
    example: {
      orderChainToken: '0x1234567890abcdef',
      adChainToken: '0x1234567890abcdef',
      amount: '1000',
      bridger: '0x1234567890abcdef',
      orderChainId: '1',
      orderPortal: '0x1234567890abcdef',
      orderRecipient: '0x1234567890abcdef',
      adId: '123e4567-e89b-12d3-a456-426614174000',
      adCreator: '0x1234567890abcdef',
      adRecipient: '0x1234567890abcdef',
      salt: '123456',
    },
  })
  orderParams!: OrderPortalParamsDto | AdManagerOrderParamsDto;

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

export class ConfirmChainActionTradeResponseDto {
  @ApiProperty({
    description: 'trade identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  tradeId!: string;

  @ApiProperty({
    description: 'Whether the chain action was confirmed successfully',
    example: true,
  })
  success!: boolean;
}

export class OrderParamsResponseDto {
  @ApiProperty({
    example: '0x1234567890abcdef',
    description: 'Order chain token address',
  })
  @IsString()
  orderChainToken!: string;

  @ApiProperty({
    example: '0x1234567890abcdef',
    description: 'Ad chain token address',
  })
  @IsString()
  adChainToken!: string;

  @ApiProperty({
    example: '1000',
    description: 'Amount of tokens',
  })
  @IsString()
  amount!: string;

  @ApiProperty({
    example: '0x1234567890abcdef',
    description: 'Bridger address',
  })
  @IsString()
  bridger!: string;

  @ApiProperty({
    example: '0x1234567890abcdef',
    description: 'Order recipient address',
  })
  @IsString()
  orderRecipient!: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Advertisement ID',
  })
  @IsString()
  adId!: string;

  @ApiProperty({
    example: '0x1234567890abcdef',
    description: 'Ad creator address',
  })
  @IsString()
  adCreator!: string;

  @ApiProperty({
    example: '0x1234567890abcdef',
    description: 'Ad recipient address',
  })
  @IsString()
  adRecipient!: string;

  @ApiProperty({
    example: '123456',
    description: 'Salt value',
  })
  @IsString()
  salt!: string;

  @ApiProperty({
    example: '1',
    description: 'Order chain ID',
  })
  @IsString()
  orderChainId?: string;

  @ApiProperty({
    example: '0x1234567890abcdef',
    description: 'Order portal address',
  })
  @IsString()
  orderPortal?: string;

  @ApiProperty({
    example: '1',
    description: 'Ad chain ID',
  })
  @IsString()
  adChainId?: string;

  @ApiProperty({
    example: '0x1234567890abcdef',
    description: 'Ad manager address',
  })
  @IsString()
  adManager?: string;
}
