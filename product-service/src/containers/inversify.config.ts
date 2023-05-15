import 'reflect-metadata'
import { Container, interfaces } from 'inversify'
import {
  ProductsRepository,
  DynamoProductsRepository,
  ProductsMockRepository,
  NotificationRepository,
  SnsRepository,
} from '@repositories'
import { ProductsService, ValidateService, SnsService } from '@services'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { SNSClient } from '@aws-sdk/client-sns'

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

productsContainer.bind<interfaces.Factory<SNSClient>>('SNS_CLIENT').toFactory<SNSClient>(() => {
  return () => new SNSClient({ region: process.env.REGION })
})

productsContainer.bind<ValidateService>(ValidateService).to(ValidateService)
productsContainer.bind<NotificationRepository>(NotificationRepository).to(SnsRepository)
productsContainer.bind<SnsService>(SnsService).to(SnsService)
