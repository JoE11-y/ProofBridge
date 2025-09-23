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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from './dto/user.dto';

@ApiTags('User')
@Controller('v1/user')
export class UserController {
  constructor(private readonly users: UserService) {}

  @ApiBearerAuth()
  @Get('me')
  @UseGuards(UserJwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the authenticated user information',
    type: UserResponseDto,
  })
  getUser(@Req() req: Request): Promise<UserResponseDto> {
    return this.users.getUser(req);
  }
}
