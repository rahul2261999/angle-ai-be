import { Global, Injectable } from '@nestjs/common';
import {
  ConfigurableModel,
  initChatModel,
} from 'langchain/chat_models/universal';
import { ConfigurationService } from '../../core/configuration/configuration.service';
import { ChatMistralAI, ChatMistralAICallOptions } from '@langchain/mistralai';

@Global()
@Injectable()
export class ChatModelService {
  private llmInstance: ChatMistralAI<ChatMistralAICallOptions>;

  constructor(private readonly configurationServce: ConfigurationService) {
    const { modelName, apiKey } = this.configurationServce.getMistralConfig();

    this.llmInstance = new ChatMistralAI({
      model: modelName,
      apiKey,
      temperature: 0.7,
    });
  }

  public getLlm() {
    return this.llmInstance;
  }
}
