import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class PrepareDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  address: string;
}

export class VerifyDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  message!: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  signature!: string;
}
