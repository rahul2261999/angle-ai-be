import { HttpStatus } from '@nestjs/common';
import BaseError from './base.error';

class Unauthorized extends BaseError {
  constructor(message: string, options?: { error?: any[] }) {
    super(message, HttpStatus.UNAUTHORIZED, { error: options?.error ?? [] });
  }
}

export default Unauthorized;
