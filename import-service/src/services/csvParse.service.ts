import { injectable } from 'inversify'
import csvParser from 'csv-parser'
import { Readable } from 'stream'

@injectable()
export class CsvParseService {
  async parseStream(stream: Readable): Promise<any> {
    const items = []
    return new Promise<any[]>((resolve) => {
      stream
        .pipe(csvParser())
        .on('data', (item) => items.push(item))
        .on('end', () => resolve(items))
    })
  }
}
