import { Injectable } from '@nestjs/common';
import { GraphStateType } from './rag.state';
import { ILoggerData } from 'src/lib/logger/logger.type';
import { AIMessage, SystemMessage } from '@langchain/core/messages';
import { ConfigurableModel } from 'langchain/chat_models/universal';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { AxiosInstance } from 'axios';
import SuccessResponse from 'src/core/response/response.util';
import { Embedding } from './rag.type';
import { RagAxiosService } from 'src/utils/axios_instances/ragAxios.service';
import { LoggingService } from 'src/lib/logger/logger.service';
import InternalServer from 'src/core/error/internal-server.error';
import { ChatModelService } from 'src/lib/chat_models/chat-modle.service';
import { ChatMistralAI, ChatMistralAICallOptions } from '@langchain/mistralai';

@Injectable()
export class RagNodes {
  private llm: ChatMistralAI<ChatMistralAICallOptions>;
  private ragAxios: AxiosInstance;

  constructor(
    private readonly loggerService: LoggingService,
    private readonly ragAxiosService: RagAxiosService,
    private readonly chatModelService: ChatModelService,
  ) {
    this.ragAxios = this.ragAxiosService.getInstance();
    this.llm = this.chatModelService.getLlm();
  }

  public rewriteQuery = async (state: GraphStateType) => {
    const loggerData: ILoggerData = {
      serviceName: 'RagService',
      function: 'rewriteQuery',
    };

    try {
      this.loggerService.info({ ...loggerData, message: 'executing' });

      const { messages } = state;
      const userQuery = messages[0].content as string;

      const rewritePrompt = ChatPromptTemplate.fromTemplate(`
        You are an expert in optimizing queries for retrieval systems.  
        Enhance the given question to improve search results from a Vector Store.  
        Make it precise, detailed, and semantically rich. return only the enhanced question and do not change the context of question
        and not add any additional info.
      
        Question: "{question}"
      `);

      const chain = RunnableSequence.from([rewritePrompt, this.llm]);

      const rewrittenQuery = await chain.invoke({
        question: userQuery,
      });

      this.loggerService.info({ ...loggerData, message: 'executed' });

      return {
        messages: [rewrittenQuery],
      };
    } catch (error) {
      this.loggerService.error({ ...loggerData, message: 'failed to execute' });

      throw new InternalServer(error.message);
    }
  };

  public retrieve = async (state: GraphStateType) => {
    const loggerData: ILoggerData = {
      serviceName: 'RagService',
      function: 'retrieve',
    };

    try {
      this.loggerService.info({ ...loggerData, message: 'executing' });

      const { messages } = state;
      const query = messages[messages.length - 1].content as string;

      const response = await this.ragAxios.post<SuccessResponse<Embedding[]>>(
        `/v1/${state.tenant.tenantId}/knowledgebases/${state.tenant.knowledgebaseId}/embeddings`,
        { query },
      );

      const { data } = response.data;

      this.loggerService.info({ ...loggerData, message: 'executed' });

      return {
        messages: [new SystemMessage(JSON.stringify(data))],
      };
    } catch (error) {
      this.loggerService.error(
        { ...loggerData, message: 'failed to execute' },
        error,
      );
      throw new InternalServer('Rag Service is down');
    }
  };

  public generateResponse = async (state: GraphStateType) => {
    const loggerData: ILoggerData = {
      serviceName: 'RagService',
      function: 'generateResponse',
    };

    try {
      this.loggerService.info({ ...loggerData, message: 'executing' });

      const { messages } = state;

      const question = messages[0].content as string;
      const context = messages[messages.length - 1].content as string;

      const prompt = ChatPromptTemplate.fromTemplate(
        `You are a helpful assistant. Given the context below, 
        answer the question strictly based on the provided information. 
        Ensure the response does not include any external knowledge. 
        If the context does not contain sufficient information, 
        give response such as: 'I'm unable to find the answer based on the given information. Could you please clarify your question?'

        Question: "{question}"
        Context: {context}
        `,
      );

      const chain = RunnableSequence.from([
        prompt,
        this.llm,
        new StringOutputParser(),
      ]);

      const response = await chain.invoke({
        question,
        context,
      });

      this.loggerService.info({ ...loggerData, message: 'executed' });

      return {
        messages: [new AIMessage(response)],
        answer: response,
      };
    } catch (error) {
      this.loggerService.error(
        { ...loggerData, message: 'failed to execute' },
        error,
      );
      throw error;
    }
  };

  public checkRelevance = async (state: GraphStateType) => {
    const loggerData: ILoggerData = {
      serviceName: 'RagService',
      function: 'checkRelevance',
    };

    try {
      this.loggerService.info({ ...loggerData, message: 'executing' });

      const { messages } = state;

      const prompt = ChatPromptTemplate.fromTemplate(
        `You are assessing the relevance of a response to a user question.
          Question: {question}
          Response: {response}
          Is this response relevant to the question? Answer with just 'yes' or 'no' only do not add any other text or special characters.`,
      );

      const chain = prompt.pipe(this.llm);

      const score = await chain.invoke({
        question: messages[0].content as string,
        response: messages[messages.length - 1].content as string,
      });

      this.loggerService.info({
        ...loggerData,
        message: 'executed',
        additionalArgs: { score },
      });

      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      return score.content.toString().toLowerCase();
    } catch (error) {
      this.loggerService.error(
        { ...loggerData, message: 'failed to execute' },
        error,
      );

      throw error;
    }
  };
}
