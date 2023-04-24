import { inject, injectable } from 'inversify'
import { S3Client, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { Repository } from '@repositories'

@injectable()
export class S3Repository implements Repository {
  private s3Client: S3Client

  constructor(@inject('S3_CLIENT') s3ClientFactory) {
    this.s3Client = s3ClientFactory()
  }

  async getSignedUrl(fileName: string): Promise<string> {
    const params = {
      Bucket: process.env.UPLOAD_BUCKET,
      Key: `${process.env.UPLOAD_FOLDER}/${fileName}`,
    } as PutObjectCommandInput

    const command = new PutObjectCommand(params)
    return getSignedUrl(this.s3Client, command)
  }
}
