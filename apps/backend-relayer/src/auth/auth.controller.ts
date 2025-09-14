import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshDto, VerifyDto } from '../dto/auth.dto';

@Controller('auth/siwe')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Get('prepare')
  @HttpCode(HttpStatus.OK)
  async prepare(@Query('address') address: string) {
    return this.auth.prepare(address);
  }

  @Post('verify')
  @HttpCode(HttpStatus.CREATED)
  async verify(@Body() dto: VerifyDto) {
    return this.auth.verify(dto.message, dto.signature);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshDto) {
    return this.auth.refresh(dto.refresh);
  }
}
