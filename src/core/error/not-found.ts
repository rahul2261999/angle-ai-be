import { HttpStatus } from '@nestjs/common';
import BaseError from './base.error';

class NotFound extends BaseError {
  constructor(message: string, options?: { error?: any[] }) {
    super(message, HttpStatus.NOT_FOUND, { error: options?.error ?? [] });
  }
}

export default NotFound;
