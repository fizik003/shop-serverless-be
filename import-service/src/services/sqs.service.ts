import { inject, injectable } from 'inversify'
import { QueueRepository } from '@repositories'

@injectable()
export class SQSService<T> {
  private queueRepository: QueueRepository

  constructor(@inject(QueueRepository) queueRepository) {
    this.queueRepository = queueRepository
  }

  async sendToQueue(messages: T[]): Promise<void> {
    await Promise.all(messages.map((mess) => this.queueRepository.sendToQueue(mess)))
  }
}
