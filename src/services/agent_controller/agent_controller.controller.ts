import { Body, Controller, Post } from '@nestjs/common';
import { AnswerDto } from './dto/answer.dto';
import { AgentControllerService } from './agent_controller.service';
import SuccessResponse from 'src/core/response/response.util';

@Controller({
  path: 'agent-controller',
  version: '1',
})
export class AgentControllerController {
  constructor(
    private readonly agentControllerService: AgentControllerService,
  ) {}

  @Post()
  async answer(@Body() answerDto: AnswerDto) {
    const response = await this.agentControllerService.answer(answerDto);

    return new SuccessResponse('Query answered successfully', {
      data: response,
    });
  }
}
