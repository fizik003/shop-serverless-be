import { StatusCode, defaultHeaders } from '@consts'

export class HttpResponse {
  private static createResponse = <T = any>(statusCode: StatusCode, data: T) => {
    return {
      statusCode,
      headers: { ...defaultHeaders },
      body: JSON.stringify(data),
    }
  }

  static success = <T>(data: T) => {
    return this.createResponse<T>(StatusCode.Success, data)
  }

  static notFoundError = (message: string = 'Not Found') =>
    this.createResponse(StatusCode.NotFound, { message })

  static serverError = (message: string = 'Something Went Wrong') =>
    this.createResponse(StatusCode.ServerError, { message })

  static bedRequest = (message: string = 'Bad Request') =>
    this.createResponse(StatusCode.BadRequest, { message })
}
