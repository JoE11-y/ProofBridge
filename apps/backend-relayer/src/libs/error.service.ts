import { Response } from 'express';
import { Injectable } from '@nestjs/common';
import { StatusCodes } from './status.codes';
import { ResponseService } from './response.service';

@Injectable()
export class ErrorService {
  private response: ResponseService;

  constructor() {
    this.response = new ResponseService();
  }

  handleServerError(res: Response, err?: any, msg?: string) {
    console.error(err);
    this.response.sendError(
      res,
      err?.status || StatusCodes.InternalServerError,
      err?.message || msg || 'Something went wrong',
    );
  }
}
