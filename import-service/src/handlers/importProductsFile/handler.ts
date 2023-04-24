import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway'
import { middyfy } from '@libs/lambda'
import schema from './schema'

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const {
      queryStringParameters: { fileName },
    } = event
  } catch (error) {}
}

export const main = middyfy(importProductsFile)
