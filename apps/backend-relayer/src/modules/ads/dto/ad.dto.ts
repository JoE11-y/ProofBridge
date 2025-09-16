import { IsIn, IsOptional, IsString, IsUUID, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryAdsDto {
  @IsOptional()
  @IsUUID()
  routeId?: string;

  @IsOptional()
  @IsString()
  creatorAddress?: string;

  @IsOptional()
  @IsString()
  status?: 'ACTIVE' | 'PAUSED' | 'EXHAUSTED' | 'CLOSED';

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  limit?: number;
}

export class CreateAdDto {
  @IsUUID()
  routeId!: string;

  // decimal string, e.g. "1000000000000000000"
  @Matches(/^\d+$/, { message: 'poolAmount must be a decimal string' })
  poolAmount!: string;

  @IsOptional()
  @Matches(/^\d+$/)
  minAmount?: string;

  @IsOptional()
  @Matches(/^\d+$/)
  maxAmount?: string;

  @IsOptional()
  metadata?: Record<string, unknown>;
}

export class UpdateAdDto {
  @IsOptional()
  @Matches(/^\d+$/)
  poolAmountTopUp?: string;

  @IsOptional()
  @IsIn(['ACTIVE', 'PAUSED', 'CLOSED'] as const)
  status?: 'ACTIVE' | 'PAUSED' | 'CLOSED';

  @IsOptional()
  @Matches(/^\d+$/)
  minAmount?: string;

  @IsOptional()
  @Matches(/^\d+$/)
  maxAmount?: string;

  @IsOptional()
  metadata?: Record<string, unknown>;
}
