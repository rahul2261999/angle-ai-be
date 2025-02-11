import serverConstant from "../../constant/server.constant";
import { asyncContextStore } from "../helper/async_context_store.util";

class SuccessResponse<T> {
  public tracingId: string | null;
  public message: string;
  public statusCode: number;
  public data: T | null;

  constructor(options?: Partial<{ message: string, statusCode: number, data: T }>) {

    this.tracingId = asyncContextStore.getTraceId();
    this.message = options?.message ?? '';
    this.statusCode = options?.statusCode ?? serverConstant.statusCodes.OK;
    this.data = options?.data ?? null;
  }
}

export default SuccessResponse;