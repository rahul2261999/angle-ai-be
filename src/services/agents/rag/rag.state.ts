import { BaseMessage } from '@langchain/core/messages';
import { Annotation } from '@langchain/langgraph';
import {  Retries, TenantState } from './rag.type';

export const InitialGraphStateSchema = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  tenant: Annotation<TenantState>(),
  answer: Annotation<string>({
    default: () => '',
    value: (x, y) => y,
  }),
  responseSchema: Annotation<string>(),
  retries: Annotation<Retries>()
});

export type GraphStateType = typeof InitialGraphStateSchema.State;
