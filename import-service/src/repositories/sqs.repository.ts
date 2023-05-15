import { inject, injectable } from 'inversify'
import { SQSClient, SendMessageCommand, SendMessageCommandInput } from '@aws-sdk/client-sqs'

import { QueueRepository } from '@repositories'

@injectable()
export class SQSRepository implements QueueRepository {
  private sqsClient: SQSClient
  private SQS_URL: string

  constructor(@inject('SQS_CLIENT') sqsClientFactory) {
    this.sqsClient = sqsClientFactory()
    this.SQS_URL = process.env.SQS_URL
  }

  async sendToQueue(message: any): Promise<void> {
    const params: SendMessageCommandInput = {
      QueueUrl: this.SQS_URL,
      MessageBody: JSON.stringify(message),
    }

    const command = new SendMessageCommand(params)

    await this.sqsClient.send(command)
  }
}
