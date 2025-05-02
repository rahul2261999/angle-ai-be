export interface TenantState {
  tenantId: string;
  knowledgebaseId: string;
}

export interface RagState {
  documents: Embedding[];
}

export interface Embedding {
  text: string;
  tag: string;
  source: string;
  revelanceScore: number;
}
