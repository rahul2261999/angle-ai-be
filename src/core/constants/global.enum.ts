export enum FileExtensions {
  'pdf' = '.pdf',
  'doc' = '.doc',
  'docx' = '.docx',
  'txt' = '.txt',
}

export enum ProcessingStatus {
  PENDING = 'PENDING',
  UPLOADING = 'UPLOADING',
  UPLOADED = 'UPLOADED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
  DELETED = 'DELETED',
}
export enum VectorDocumentSource {
  DOCUMENT = 'DOCUMENT',
  WEBSITE = 'WEBSITE',
}

export enum Status {
  ACTIVE = 'ACTIVE',
  DISABLE = 'DISABLE',
  DELETED = 'DELETED',
}

export enum CrawlingSessionStatus {
  IN_PROGRESS = 'IN-PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCLED = 'CANCLED',
}

export enum CrawledUrlStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  SKIPPED = 'SKIPPED',
}
