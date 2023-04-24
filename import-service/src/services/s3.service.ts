import { injectable, inject } from 'inversify'

import { Repository, S3Repository } from '@repositories'

@injectable()
export class s3Service {
  private s3Repository: Repository

  constructor(@inject(S3Repository) s3Repository) {
    this.s3Repository = s3Repository
  }

  async getSignedUrl(fileName: string): Promise<string> {
    return this.s3Repository.getSignedUrl(fileName)
  }
}
