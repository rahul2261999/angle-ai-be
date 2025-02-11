import serverConstant from "../../constant/server.constant";
import BaseError from "./base.error";

class NotFound extends BaseError {
  constructor(message: string, options?: { error?: any[] }) {
    super(
      message,
      serverConstant.statusCodes.NOT_FOUND,
      {
        error: options?.error ?? [],
      }
    );
  }
}

export default NotFound;