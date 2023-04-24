import 'reflect-metadata'
import { Container, interfaces } from 'inversify'
import { S3Client } from '@aws-sdk/client-s3'

export const importServiceContainer = new Container()

importServiceContainer.bind<interfaces.Factory<S3Client>>('S3_CLIENT').toFactory<S3Client>(() => {
  return () => {
    const region = process.env.REGION
    return new S3Client({ region })
  }
})
