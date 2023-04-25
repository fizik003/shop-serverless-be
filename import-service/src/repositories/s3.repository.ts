import { inject, injectable } from 'inversify'
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  GetObjectCommand,
  GetObjectCommandInput,
  CopyObjectCommand,
  CopyObjectCommandInput,
  DeleteObjectCommand,
  DeleteObjectCommandInput,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { Repository } from '@repositories'
import { Readable } from 'stream'

@injectable()
export class S3Repository implements Repository {
  private s3Client: S3Client
  private BUCKET_NAME: string
  private UPLOAD_FOLDER: string
  private PARSED_FOLDER: string

  constructor(@inject('S3_CLIENT') s3ClientFactory) {
    this.s3Client = s3ClientFactory()
    this.BUCKET_NAME = process.env.UPLOAD_BUCKET
    this.UPLOAD_FOLDER = process.env.UPLOAD_FOLDER
    this.PARSED_FOLDER = process.env.PARSED_FOLDER
  }

  async getSignedUrl(fileName: string): Promise<string> {
    const params = {
      Bucket: this.BUCKET_NAME,
      Key: `${this.UPLOAD_FOLDER}/${fileName}`,
    } as PutObjectCommandInput

    const command = new PutObjectCommand(params)
    return getSignedUrl(this.s3Client, command)
  }

  async readFile(fileName: string): Promise<Readable | undefined> {
    const params = { Bucket: this.BUCKET_NAME, Key: fileName } as GetObjectCommandInput
    const command = new GetObjectCommand(params)
    const data = await this.s3Client.send(command)
    return data.Body as Readable | undefined
  }

  async copyFile(sourceFileName: string, newPathFileName: string): Promise<void> {
    const params = {
      Bucket: this.BUCKET_NAME,
      CopySource: `${this.BUCKET_NAME}/${sourceFileName}`,
      Key: `${newPathFileName}`,
    } as CopyObjectCommandInput
    const command = new CopyObjectCommand(params)
    await this.s3Client.send(command)
  }

  async deleteFile(fileName: string): Promise<void> {
    const params = {
      Bucket: this.BUCKET_NAME,
      Key: fileName,
    } as DeleteObjectCommandInput

    const command = new DeleteObjectCommand(params)

    await this.s3Client.send(command)
  }
}
