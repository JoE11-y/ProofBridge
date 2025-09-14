import { IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class ChallengeDTO {
  @IsString()
  @Transform(({ value }) => value.trim())
  address: string;
}

export class LoginDTO {
  @IsString()
  @Transform(({ value }) => value.trim())
  message!: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  signature!: string;
}

export class RefreshDto {
  @IsString()
  @MinLength(10)
  refresh!: string;
}
