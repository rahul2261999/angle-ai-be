import { HumanMessage } from '@langchain/core/messages';
import { END, START, StateGraph } from '@langchain/langgraph';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LoggingService } from 'src/lib/logger/logger.service';
import { ILoggerData } from 'src/lib/logger/logger.type';
import {
  CHECK_RELEVANCE,
  GENERATE_RESPONSE,
  RETRIEVE,
  REWRITE_QUERY,
} from './rag.enum';
import { GraphStateType, InitialGraphStateSchema } from './rag.state';
import { TenantState } from './rag.type';
import { MemorySaver } from '@langchain/langgraph';
import { RagNodes } from './rag.node';

@Injectable()
export class RagService {
  private GraphStateSchema = InitialGraphStateSchema;
  private graph: ReturnType<StateGraph<GraphStateType>['compile']>;

  constructor(
    private readonly loggerService: LoggingService,
    private readonly ragNodes: RagNodes,
  ) {

    try {
      const node = {
        [RETRIEVE]: this.ragNodes.retrieve,
        [CHECK_RELEVANCE]: this.ragNodes.checkRelevance,
        [REWRITE_QUERY]: this.ragNodes.rewriteQuery,
        [GENERATE_RESPONSE]: this.ragNodes.generateResponse,
      };

      const workflow = new StateGraph(this.GraphStateSchema);

      // Add nodes
      workflow
        .addNode(REWRITE_QUERY, node[REWRITE_QUERY])
        .addNode(RETRIEVE, node[RETRIEVE])
        .addNode(GENERATE_RESPONSE, node[GENERATE_RESPONSE])

        // Add edges (continue chaining)
        .addEdge(START, REWRITE_QUERY)
        .addEdge(REWRITE_QUERY, RETRIEVE)
        .addEdge(RETRIEVE, GENERATE_RESPONSE)
        .addConditionalEdges(GENERATE_RESPONSE, node[CHECK_RELEVANCE], {
          yes: END,
          no: REWRITE_QUERY,
        });

      const checkpointer = new MemorySaver();

      this.graph = workflow.compile({ checkpointer });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async runFlow(userInput: string, tenant: TenantState) {
    const loggerData: ILoggerData = {
      serviceName: 'RagService',
      function: 'runFlow',
    };

    try {
      this.loggerService.info({ ...loggerData, message: 'executing' });

      // Run the graph
      const initState: GraphStateType = {
        messages: [new HumanMessage(userInput)],
        tenant: tenant,
        answer: '',
      };

      const configurable = {
        thread_id: 'user-1',
      };

      const result = await this.graph.invoke(initState, { configurable });

      this.loggerService.info({ ...loggerData, message: 'executed' });

      return result.answer as GraphStateType['answer'];
    } catch (error) {
      this.loggerService.error(
        { ...loggerData, message: 'failed to execute' },
        error,
      );
      throw error;
    }
  }
}
