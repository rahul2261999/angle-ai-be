import { Global, Module } from '@nestjs/common';
import { ChatModelService } from './chat-modle.service';

@Global()
@Module({
  providers: [ChatModelService],
  exports: [ChatModelService],
})
export class ChatModelsModule {}
