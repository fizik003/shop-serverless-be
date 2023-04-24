import { injectable, inject } from 'inversify'
import { Readable } from 'stream'

import { Repository, S3Repository } from '@repositories'

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

  async moveFile(sourceFileName: string, newPathFileName: string): Promise<void> {
    await this.s3Repository.copyFile(sourceFileName, newPathFileName)
    await this.s3Repository.deleteFile(sourceFileName)
  }
}
