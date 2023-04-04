import { StatusCode } from "@consts";

export class HttpResponse {
  private static createResponse = <T = any>(
    statusCode: StatusCode,
    data: T
  ) => {
    return {
      status: statusCode,
      body: JSON.stringify(data),
    };
  };

  static success = <T>(data: T) => {
    return this.createResponse<T>(StatusCode.Success, data);
  };

  static notFoundError = (data) =>
    this.createResponse(StatusCode.NotFound, data);
}
