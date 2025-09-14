import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminAuthDTO } from '../dto/admin.dto';
import type { Request } from 'express';
import { AdminJwtGuard } from '../guards/admin-jwt.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminAuth: AdminService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: AdminAuthDTO) {
    return this.adminAuth.login(dto);
  }

  @Post('addAdmin')
  @UseGuards(AdminJwtGuard)
  @HttpCode(HttpStatus.CREATED)
  addAdmin(@Req() req: Request, @Body() dto: AdminAuthDTO) {
    return this.adminAuth.addAdmin(req, dto);
  }
}
