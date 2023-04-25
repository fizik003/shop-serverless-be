import { injectable, inject } from 'inversify'
import { Readable } from 'stream'

import { Repository, S3Repository } from '@repositories'

const PARSED_FOLDER = process.env.PARSED_FOLDER

@injectable()
export class S3Service {
  private s3Repository: Repository

  constructor(@inject(S3Repository) s3Repository) {
    this.s3Repository = s3Repository
  }

  async getSignedUrl(fileName: string): Promise<string> {
    return this.s3Repository.getSignedUrl(fileName)
  }

  async readFile(fileName: string): Promise<Readable | undefined> {
    return this.s3Repository.readFile(fileName)
  }

  async moveFile(sourceFileName: string, fileName: string, path = PARSED_FOLDER): Promise<void> {
    const newPathFileName = `${path}/${fileName}`
    await this.s3Repository.copyFile(sourceFileName, newPathFileName)
    await this.s3Repository.deleteFile(sourceFileName)
  }
}
