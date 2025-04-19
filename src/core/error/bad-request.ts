import { HttpStatus } from '@nestjs/common';
import BaseError from './base.error';

class BadRequest extends BaseError {
  constructor(message: string, options?: { error?: any[] }) {
    super(message, HttpStatus.BAD_REQUEST, { error: options?.error ?? [] });
  }
}

export default BadRequest;
