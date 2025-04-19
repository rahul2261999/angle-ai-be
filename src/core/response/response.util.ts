import { HttpStatus } from '@nestjs/common';

class SuccessResponse<T> {
  public message: string;
  public statusCode: number;
  public data: T | null;

  constructor(
    message: string,
    options?: Partial<{ statusCode: number; data: T }>,
  ) {
    this.message = message;
    this.statusCode = options?.statusCode ?? HttpStatus.OK;
    this.data = options?.data ?? null;
  }
}

export default SuccessResponse;
