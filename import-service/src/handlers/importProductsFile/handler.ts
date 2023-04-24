import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway'
import { middyfy } from '@libs/lambda'
import schema from './schema'

import { S3Client } from '@aws-sdk/client-s3'

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const {
      queryStringParameters: { fileName },
    } = event

    const s3Client = new S3Client(process.env.REGION)
    
  } catch (error) {}
}

export const main = middyfy(importProductsFile)
