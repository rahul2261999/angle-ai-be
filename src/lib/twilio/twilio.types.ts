export interface SendMessagePayload {
  sender: string;
  recipient: string;
  message: string
  statusCallback?: string;
}