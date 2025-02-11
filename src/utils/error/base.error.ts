import { asyncContextStore } from "../helper/async_context_store.util";

abstract class BaseError extends Error {
  protected tracingId: string | null;
  protected statusCode: number;
  protected error?: any[];


  constructor(message: string, statusCode: number, options?: { error: any[] }) {
    super(message);
    this.name = this.constructor.name;
    this.tracingId = asyncContextStore.getTraceId();
    this.statusCode = statusCode;
    this.error = options?.error ?? [];

    // Capture the stack trace, skipping the constructor function itself
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack; // Fallback for non-V8 environments
    }

    // Fix the prototype chain
    Object.setPrototypeOf(this, new.target.prototype);
  }

  public getStatusCode(): number {
    return this.statusCode;
  }

  public toJson() {
    return {
      tracingId: this.tracingId,
      statusCode: this.statusCode,
      message: this.message,
      error: this.error,
    };
  }
}

export default BaseError;