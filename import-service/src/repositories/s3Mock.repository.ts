import { injectable } from 'inversify'

import { Repository } from '@repositories'
import { Readable } from 'stream'

@injectable()
export class S3MockRepository implements Repository {
  async getSignedUrl(fileName: string): Promise<string> {
    return fileName
  }

  async readFile(fileName: string): Promise<Readable> {
    const stream = new Readable()
    stream._read = () => {}
    stream.push(fileName)
    stream.push(null)
    return stream
  }

  // @ts-ignore
  async copyFile(sourceFileName: string, newPathFileName: string): Promise<void> {
    return Promise.resolve()
  }

  // @ts-ignore
  async deleteFile(fileName: string): Promise<void> {
    return Promise.resolve()
  }
}
