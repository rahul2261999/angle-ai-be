import { Module } from '@nestjs/common';
import { RagAxiosService } from './ragAxios.service';

@Module({
  providers: [RagAxiosService],
  exports: [RagAxiosService],
})
export class AxiosModule {}
