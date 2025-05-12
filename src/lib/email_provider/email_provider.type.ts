export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
}

export interface EmailOptions {
  from?: EmailRecipient;
  to: EmailRecipient | EmailRecipient[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: EmailAttachment[];
  cc?: EmailRecipient | EmailRecipient[];
  bcc?: EmailRecipient | EmailRecipient[];
  replyTo?: EmailRecipient;
  tags?: Record<string, string>;
}

export type BulkEmailOptions = EmailOptions[]

export interface EmailResponse {
  id?: string;
  messageId?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EmailProvider {
  sendEmail(options: EmailOptions): Promise<EmailResponse>;
  sendBulkEmails(options: BulkEmailOptions): Promise<EmailResponse[]>;
}

export interface EmailProviderConfig {
  apiKey: string;
  defaultFrom?: EmailRecipient;
  // Add other provider-specific configuration options here
}

export const EMAIL_PROVIDER = 'EMAIL_PROVIDER';
