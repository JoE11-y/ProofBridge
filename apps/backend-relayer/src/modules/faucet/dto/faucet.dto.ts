import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestFaucetDto {
  @ApiProperty({
    description: 'Token ID (UUID) to request faucet for',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  tokenId!: string;
}

export class FaucetResponseDto {
  @ApiProperty({
    description: 'Transaction hash of the mint transaction',
    type: 'string',
  })
  txHash!: string;

  @ApiProperty({
    description: 'Token symbol that was minted',
    type: 'string',
  })
  symbol!: string;

  @ApiProperty({
    description: 'Chain ID where the transaction was executed',
    type: 'string',
  })
  chainId!: string;

  @ApiProperty({
    description: 'Amount of tokens minted',
    type: 'string',
  })
  amount!: string;
}
