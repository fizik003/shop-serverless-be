import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, BatchWriteCommand } from '@aws-sdk/lib-dynamodb'
import { fromIni } from '@aws-sdk/credential-providers'
import { productsMock } from '@mocks'

const REGION = 'us-east-1'
const PRODUCTS_TABLE = 'products'
const STOCK_TABLE = 'stock'

const dynamoClient = new DynamoDBClient({
  region: REGION,
  credentials: fromIni({ profile: 'sandx' }),
})

const documentClient = DynamoDBDocumentClient.from(dynamoClient)

const productsRequest = productsMock.map((product) => ({
  PutRequest: {
    Item: product,
  },
}))

const stockRequest = productsMock.map(({ id }) => ({
  PutRequest: {
    Item: {
      product_id: id,
      count: Math.round(Math.random() * 10 + 1),
    },
  },
}))

documentClient
  .send(new BatchWriteCommand({ RequestItems: { [PRODUCTS_TABLE]: productsRequest } }))
  .then(() => {
    console.log('products are ready')
  })

documentClient
  .send(new BatchWriteCommand({ RequestItems: { [STOCK_TABLE]: stockRequest } }))
  .then(() => {
    console.log('stocks are ready')
  })
