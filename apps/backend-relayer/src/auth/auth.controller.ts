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
import { RefreshDto, LoginDTO } from '../dto/auth.dto';

@Controller('/v1/auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Get('challenge')
  @HttpCode(HttpStatus.OK)
  async challenge(@Query('address') address: string) {
    return this.auth.challenge(address);
  }

  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  async login(@Body() dto: LoginDTO) {
    return this.auth.login(dto.message, dto.signature);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshDto) {
    return this.auth.refresh(dto.refresh);
  }
}
