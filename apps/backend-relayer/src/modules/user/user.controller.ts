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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from './dto/user.dto';

@ApiTags('User')
@Controller('v1/user')
export class UserController {
  constructor(private readonly users: UserService) {}

  @ApiBearerAuth()
  @Get('me')
  @UseGuards(UserJwtGuard)
  @HttpCode(HttpStatus.OK)
  getUser(@Req() req: Request): Promise<UserResponseDto> {
    return this.users.getUser(req);
  }
}
