import 'reflect-metadata'
import { Container, interfaces } from 'inversify'
import { ProductsRepository, DynamoProductsRepository } from '@repositories'
import { ProductsService } from '@services'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

// import { fromIni } from '@aws-sdk/credential-providers'

export const productsContainer = new Container()
productsContainer.bind<ProductsRepository>(ProductsRepository).to(DynamoProductsRepository)
productsContainer.bind<ProductsService>(ProductsService).to(ProductsService)

productsContainer
  .bind<interfaces.Factory<DynamoDBDocument>>('DYNAMO-CLIENT')
  .toFactory<DynamoDBDocument>(() => {
    return () => {
      const marshallOptions = {
        convertEmptyValues: false,
        removeUndefinedValues: false,
        convertClassInstanceToMap: false,
      }

      const unmarshallOptions = {
        wrapNumbers: false,
      }

      const client = new DynamoDBClient({
        region: process.env.REGION,
        // credentials: fromIni({ profile: 'sandx' }),
      })
      return DynamoDBDocument.from(client, {
        marshallOptions,
        unmarshallOptions,
      })
    }
  })
productsContainer
  .bind<DynamoProductsRepository>(DynamoProductsRepository)
  .to(DynamoProductsRepository)
