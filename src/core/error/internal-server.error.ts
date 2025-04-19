import { HttpStatus } from '@nestjs/common';
import BaseError from './base.error';

class InternalServer extends BaseError {
  constructor(message: string, options?: { error?: any[] }) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, {
      error: options?.error ?? [],
    });
  }
}

export default InternalServer;
