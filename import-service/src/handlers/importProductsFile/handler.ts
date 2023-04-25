import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway'
import { middyfy } from '@libs/lambda'
import schema from './schema'
import { fileNameQuerySchema, HttpResponse } from '@utils'
import { importServiceContainer } from '@containers'
import { S3Service } from '@services'

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log('Lambda invocation with event: ', JSON.stringify(event))

  try {
    const s3Service = importServiceContainer.resolve(S3Service)
    const { queryStringParameters } = event

    try {
      await fileNameQuerySchema.validate(queryStringParameters)
    } catch (error) {
      return HttpResponse.bedRequest()
    }

    const { fileName } = queryStringParameters

    const url = await s3Service.getSignedUrl(fileName)
    return HttpResponse.success(url)
  } catch (error) {
    console.log('An error occurred while create signed url', error)

    return HttpResponse.serverError(error)
  }
}

export const main = middyfy(importProductsFile)
