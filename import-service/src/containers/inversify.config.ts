import 'reflect-metadata'
import { Container, interfaces } from 'inversify'
import { S3Client } from '@aws-sdk/client-s3'

import { Repository, S3Repository } from '@repositories'
import { S3Service } from '@services'

export const importServiceContainer = new Container()

importServiceContainer.bind<interfaces.Factory<S3Client>>('S3_CLIENT').toFactory<S3Client>(() => {
  return () => {
    const region = process.env.REGION
    return new S3Client({ region })
  }
})

importServiceContainer.bind<Repository>(S3Repository).to(S3Repository)
importServiceContainer.bind<S3Service>(S3Service).to(S3Service)
