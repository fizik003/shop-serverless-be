import 'reflect-metadata'
import { Container, interfaces } from 'inversify'
import { S3Client } from '@aws-sdk/client-s3'
import { SQSClient } from '@aws-sdk/client-sqs'

import { Repository, S3Repository, SQSRepository, QueueRepository } from '@repositories'
import { S3Service, CsvParseService, SQSService } from '@services'
import { ProductCreateData } from '@types'

export const importServiceContainer = new Container()

importServiceContainer.bind<interfaces.Factory<S3Client>>('S3_CLIENT').toFactory<S3Client>(() => {
  return () => {
    const region = process.env.REGION
    return new S3Client({ region })
  }
})

importServiceContainer
  .bind<interfaces.Factory<SQSClient>>('SQS_CLIENT')
  .toFactory<SQSClient>(() => {
    return () => {
      const region = process.env.REGION
      return new SQSClient({ region })
    }
  })

importServiceContainer.bind<Repository>(Repository).to(S3Repository)
importServiceContainer.bind<S3Service>(S3Service).to(S3Service)
importServiceContainer.bind<CsvParseService>(CsvParseService).to(CsvParseService)
importServiceContainer.bind<QueueRepository>(QueueRepository).to(SQSRepository)
importServiceContainer.bind<SQSService<ProductCreateData>>('SQSProductService').to(SQSService)
