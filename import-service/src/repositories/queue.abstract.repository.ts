export abstract class QueueRepository {
  abstract sendToQueue(message): Promise<void>
}
