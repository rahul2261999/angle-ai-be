import { Test, TestingModule } from '@nestjs/testing';
import { AgentControllerController } from './agent_controller.controller';

describe('AgentControllerController', () => {
  let controller: AgentControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgentControllerController],
    }).compile();

    controller = module.get<AgentControllerController>(
      AgentControllerController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
