import { Readable } from 'stream'

export abstract class Repository {
  abstract getSignedUrl(fileName: string): Promise<string>
  abstract readFile(fileName: string): Promise<Readable | undefined>
  abstract copyFile(sourceFileName: string, newPathFileName: string): Promise<void>
  abstract deleteFile(fileName: string): Promise<void>
}
