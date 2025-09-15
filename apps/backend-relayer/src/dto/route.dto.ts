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

export class QueryRoutesDto {
  // Direct by token UUIDs
  @IsOptional()
  @IsUUID()
  fromTokenId?: string;

  @IsOptional()
  @IsUUID()
  toTokenId?: string;

  @IsOptional()
  @Matches(/^\d+$/)
  fromChainId?: string;

  @IsOptional()
  @Matches(/^\d+$/)
  toChainId?: string;

  @IsOptional()
  @IsString()
  symbol?: string;

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

export class CreateRouteDto {
  @IsUUID()
  fromTokenId!: string;

  @IsUUID()
  toTokenId!: string;

  @IsOptional()
  metadata?: object;
}
