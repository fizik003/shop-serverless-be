import { injectable, inject } from 'inversify'
import { SNSClient, PublishCommand, PublishCommandInput } from '@aws-sdk/client-sns'

import { NotificationRepository } from '@repositories'
import { Notification } from 'src/types'

@injectable()
export class SnsRepository implements NotificationRepository {
  private snsClient: SNSClient
  private snsArn: string
  constructor(@inject('SNS_CLIENT') snsClientFactory) {
    this.snsClient = snsClientFactory()
    this.snsArn = process.env.SNS_ARN
  }

  async sendNotification(notification: Notification): Promise<void> {
    const params: PublishCommandInput = {
      ...notification,
      TopicArn: this.snsArn,
    }

    const command = new PublishCommand(params)

    await this.snsClient.send(command)
  }
}
