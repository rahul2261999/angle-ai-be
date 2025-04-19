import { Module } from '@nestjs/common';
import { GlobalExceptionFilter } from './global-error';

@Module({
  imports: [],
  providers: [GlobalExceptionFilter],
  exports: [GlobalExceptionFilter],
})
export class ErrorModule {}
