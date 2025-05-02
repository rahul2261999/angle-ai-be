import { Module } from '@nestjs/common';
import { RagModule } from './rag/rag.module';
import { AppointmentModule } from './appointment/appointment.module';

@Module({
  imports: [RagModule, AppointmentModule],
  exports: [RagModule, AppointmentModule],
})
export class AgentsModule {}
