import { IsIn, IsOptional, IsString, IsUUID, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class QueryAdsDto {
  @ApiPropertyOptional({
    type: String,
    format: 'uuid',
    description: 'UUID of the route to filter ads by',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  routeId?: string;

  @ApiPropertyOptional({
    description: "Creator's blockchain address",
    example: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  })
  @IsOptional()
  @IsString()
  creatorAddress?: string;

  @ApiPropertyOptional({
    enum: ['ACTIVE', 'PAUSED', 'EXHAUSTED', 'CLOSED'],
    description: 'Current status of the ad',
    example: 'ACTIVE',
  })
  @IsOptional()
  @IsString()
  @IsIn(['ACTIVE', 'PAUSED', 'EXHAUSTED', 'CLOSED'] as const)
  status?: 'ACTIVE' | 'PAUSED' | 'EXHAUSTED' | 'CLOSED';

  @ApiPropertyOptional({
    description: 'Pagination cursor',
    example:
      'eyJpZCI6IjEyMyIsImNyZWF0ZWRBdCI6IjIwMjMtMDEtMDFUMDA6MDA6MDAuMDAwWiJ9',
  })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiPropertyOptional({
    type: Number,
    description: 'Number of items to return per page',
    example: 10,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  limit?: number;
}

export class CreateAdDto {
  @ApiProperty({
    type: String,
    format: 'uuid',
    description: 'UUID of the route to create ad for',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  routeId!: string;

  @ApiProperty({
    description: 'Destination blockchain address of the creator',
    example: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  })
  @IsString()
  creatorDstAddress!: string;

  @ApiPropertyOptional({
    type: Object,
    description: 'Additional metadata for the ad',
    example: { title: 'My Ad', description: 'Ad description' },
  })
  @IsOptional()
  metadata?: Record<string, unknown>;
}

export class FundAdDto {
  @ApiProperty({
    pattern: '^d+$',
    description: 'Amount to add to the ad pool (in smallest unit)',
    example: '1000000000000000000',
  })
  @Matches(/^\d+$/)
  poolAmountTopUp!: string;
}

export class WithdrawalAdDto {
  @ApiProperty({
    pattern: '^d+$',
    description: 'Amount to withdraw from the ad pool (in smallest unit)',
    example: '1000000000000000000',
  })
  @Matches(/^\d+$/)
  poolAmountWithdraw!: string;

  @ApiProperty({
    description: 'Destination address for withdrawal',
    example: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  })
  @IsString()
  to!: string;
}

export class UpdateAdDto {
  @ApiPropertyOptional({
    enum: ['ACTIVE', 'PAUSED'],
    description: 'New status for the ad',
    example: 'ACTIVE',
  })
  @IsOptional()
  @IsIn(['ACTIVE', 'PAUSED'] as const)
  status?: 'ACTIVE' | 'PAUSED';

  @ApiPropertyOptional({
    pattern: '^d+$',
    description: 'Minimum amount for the ad (in smallest unit)',
    example: '100000000000000000',
  })
  @IsOptional()
  @Matches(/^\d+$/)
  minAmount?: string;

  @ApiPropertyOptional({
    pattern: '^d+$',
    description: 'Maximum amount for the ad (in smallest unit)',
    example: '5000000000000000000',
  })
  @IsOptional()
  @Matches(/^\d+$/)
  maxAmount?: string;

  @ApiPropertyOptional({
    type: Object,
    description: 'Updated metadata for the ad',
    example: { title: 'Updated Ad', description: 'New description' },
  })
  @IsOptional()
  metadata?: Record<string, unknown>;
}

export class CloseAdDto {
  @ApiProperty({
    description: 'Address to send remaining funds when closing the ad',
    example: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  })
  @IsString()
  to: string;
}

export class ConfirmAdActionDto {
  @ApiProperty({
    description: 'Transaction hash of the chain action',
    example:
      '0x123f681646d4a755815f9cb19e1acc8565a0c2ac8e625e37ef3dbf9c8feb8a7e',
  })
  @IsString()
  txHash!: string;

  @ApiPropertyOptional({
    description: 'Optional signature for the chain action',
    example:
      '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  })
  @IsOptional()
  @IsString()
  signature?: string;
}
