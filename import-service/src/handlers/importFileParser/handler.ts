import { S3Event } from 'aws-lambda'

import { importServiceContainer } from '@containers'
import { CsvParseService, S3Service, SQSService } from '@services'
import { ProductCreateData } from '@types'

const importFileParser = async (event: S3Event) => {
  const csvParseService = importServiceContainer.get(CsvParseService)
  const s3Service = importServiceContainer.get(S3Service)
  const sqsProductService = importServiceContainer.get(
    'SQSProductService'
  ) as SQSService<ProductCreateData>

  console.log('Lambda invocation with event: ', JSON.stringify(event))
  try {
    await Promise.all(
      event.Records.map(async (record) => {
        const fileReadableStream = await s3Service.readFile(record.s3.object.key)
        if (!fileReadableStream) throw new Error('File not found')
        const parsedData = (await csvParseService.parseStream(
          fileReadableStream
        )) as ProductCreateData[]

        console.log('Parsed items', parsedData)
        console.log('Start moving ', record.s3.object.key)

        const fileName = record.s3.object.key.split('/').pop()
        await s3Service.moveFile(record.s3.object.key, fileName)
        console.log(`File ${record.s3.object.key} was success moved to parsed directory`)

        console.log('Send data to queue')

        await sqsProductService.sendToQueue(parsedData)

        console.log('Send successfully')
      })
    )
  } catch (error) {
    console.log('Error: ', error)
  }
}

export const main = importFileParser
