import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserJwtGuard } from '../../common/guards/user-jwt.guard';
import type { Request } from 'express';

@Controller('v1/user')
export class UserController {
  constructor(private readonly users: UserService) {}

  @Get('me')
  @UseGuards(UserJwtGuard)
  @HttpCode(HttpStatus.OK)
  getUser(@Req() req: Request) {
    return this.users.getUser(req);
  }
}
