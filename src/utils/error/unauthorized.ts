import serverConstant from "../../constant/server.constant";
import BaseError from "./base.error";

class UnAuthorized extends BaseError {
  constructor(message: string, options?: { error?: any[] }) {
    super(
      message,
      serverConstant.statusCodes.UNAUTHORIZED,
      {
        error: options?.error ?? [],
      }
    );
  }
}

export default UnAuthorized;