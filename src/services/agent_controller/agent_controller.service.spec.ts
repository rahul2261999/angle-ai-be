import { Test, TestingModule } from '@nestjs/testing';
import { AgentControllerService } from './agent_controller.service';

describe('AgentControllerService', () => {
  let service: AgentControllerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgentControllerService],
    }).compile();

    service = module.get<AgentControllerService>(AgentControllerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
