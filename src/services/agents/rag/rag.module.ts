import { Module } from '@nestjs/common';
import { RagService } from './rag.service';
import { AxiosModule } from 'src/utils/axios_instances/axios.module';
import { RagNodes } from './rag.node';

@Module({
  imports: [AxiosModule],
  providers: [RagService, RagNodes],
  exports: [RagService],
})
export class RagModule {}
