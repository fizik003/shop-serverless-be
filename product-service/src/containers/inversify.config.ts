import 'reflect-metadata'
import { Container, interfaces } from 'inversify'
import { ProductsRepository, DynamoProductsRepository, ProductsMockRepository } from '@repositories'
import { ProductsService, ValidateService } from '@services'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

// import { fromIni } from '@aws-sdk/credential-providers'

const defaultProductRepository =
  process.env.MOCK === 'true' ? ProductsMockRepository : DynamoProductsRepository

export const productsContainer = new Container()
productsContainer.bind<ProductsRepository>(ProductsRepository).to(defaultProductRepository)
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

productsContainer.bind<ValidateService>(ValidateService).to(ValidateService)
