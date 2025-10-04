import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseChainIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!/^\d+$/.test(value)) {
      throw new BadRequestException('chainId must be a decimal string');
    }
    return value;
  }
}
