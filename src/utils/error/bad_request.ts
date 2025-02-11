import serverConstant from "../../constant/server.constant";
import BaseError from "./base.error";

class BadRequest extends BaseError {
  constructor(message: string, options?: { error?: any[] }) {
    super(
      message,
      serverConstant.statusCodes.BAD_REQUEST,
      { error: options?.error ?? [], }
    );
  }
}

export default BadRequest;