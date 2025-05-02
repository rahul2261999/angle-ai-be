import { Module } from '@nestjs/common';
import { RagModule } from '../agents/rag/rag.module';
import { AgentControllerService } from './agent_controller.service';
import { AgentControllerController } from './agent_controller.controller';

@Module({
  imports: [RagModule],
  providers: [AgentControllerService],
  controllers: [AgentControllerController],
})
export class AgentControllerModule {}
