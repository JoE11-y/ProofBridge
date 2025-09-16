import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  IsNotEmpty,
  Matches,
} from 'class-validator';

export class QueryChainsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  chainId?: string;

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

export class CreateChainDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @Matches(/^\d+$/)
  chainId!: string;

  @IsString()
  @IsNotEmpty()
  adManagerAddress!: string;

  @IsString()
  @IsNotEmpty()
  orderPortalAddress!: string;
}

export class UpdateChainDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d+$/)
  chainId?: string;

  @IsOptional()
  @IsString()
  adManagerAddress?: string;

  @IsOptional()
  @IsString()
  orderPortalAddress?: string;
}
