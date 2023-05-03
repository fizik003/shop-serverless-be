import { SQSEvent } from 'aws-lambda'

import { main as catalogBatchProcess } from './handler'
import { productsMock } from '@mocks'
import {
  NotificationRepository,
  NotificationMockRepository,
  ProductsRepository,
  ProductsMockRepository,
} from '@repositories'
import { productsContainer } from '@containers'

const sqsEventMock: SQSEvent = {
  Records: [
    {
      messageId: '29008e5c-1ec9-4827-812c-d17b4b68b874',
      receiptHandle:
        'AQEB7s5gR4ngtghU/7QQicO8is0MqhiatSTHKgTQ4tzKGY924M8Bg8SZzrV1kt+vYIGiU7S3Be45ZUbGyCM/P1lnlOfHpGKzCC7QclS4ovxknQ50LckIyZzdQ5hPnobW6TlXmsnOcoWnkntYJDk8KcWHc3gtx9yUdVt3nZj1cgRd/FXFTh/TMx60+gOhjtpgMewsJ/6q96JpM4Cry+B7/lzgT4MDtD5O7wrJOktfx5Qb/ix4O2uw/yCnYZ3zmgnW0R9FF/1WChWbqv6UmQnAxevQzYnDgORdu5AqRvXe6ECDWAtvDzVJcWO+cl+ctM0Jdg89xrb4CrRXu8eH5OqH7M9A6jZ5A6WHMJVjaNhKj5Z2sqeFI1s5C//JQAnD77+nsmmWEim9r2LGEo2gSCR1YlZAbA==',
      body: JSON.stringify(productsMock[0]),
      attributes: {
        ApproximateReceiveCount: '1',
        AWSTraceHeader:
          'Root=1-64520452-4ef5c9bc2716358874747fa3;Parent=0483058668e932ba;Sampled=0',
        SentTimestamp: '1683096659278',
        SenderId: 'AROA2BN5HAKWJ7BBQYQBM:import-service-dev-importFileParser',
        ApproximateFirstReceiveTimestamp: '1683096659281',
      },
      messageAttributes: {},
      md5OfBody: '9aceb4682a96f19c17ac8cde7ce89cf4',
      eventSource: 'aws:sqs',
      eventSourceARN: 'arn:aws:sqs:us-east-1:690275943084:ProductsSQSQueue',
      awsRegion: 'us-east-1',
    },
    {
      messageId: '29008e5c-1ec9-4827-812c-d17b4b68b874',
      receiptHandle:
        'AQEB7s5gR4ngtghU/7QQicO8is0MqhiatSTHKgTQ4tzKGY924M8Bg8SZzrV1kt+vYIGiU7S3Be45ZUbGyCM/P1lnlOfHpGKzCC7QclS4ovxknQ50LckIyZzdQ5hPnobW6TlXmsnOcoWnkntYJDk8KcWHc3gtx9yUdVt3nZj1cgRd/FXFTh/TMx60+gOhjtpgMewsJ/6q96JpM4Cry+B7/lzgT4MDtD5O7wrJOktfx5Qb/ix4O2uw/yCnYZ3zmgnW0R9FF/1WChWbqv6UmQnAxevQzYnDgORdu5AqRvXe6ECDWAtvDzVJcWO+cl+ctM0Jdg89xrb4CrRXu8eH5OqH7M9A6jZ5A6WHMJVjaNhKj5Z2sqeFI1s5C//JQAnD77+nsmmWEim9r2LGEo2gSCR1YlZAbA==',
      body: JSON.stringify(productsMock[0]),
      attributes: {
        ApproximateReceiveCount: '1',
        AWSTraceHeader:
          'Root=1-64520452-4ef5c9bc2716358874747fa3;Parent=0483058668e932ba;Sampled=0',
        SentTimestamp: '1683096659278',
        SenderId: 'AROA2BN5HAKWJ7BBQYQBM:import-service-dev-importFileParser',
        ApproximateFirstReceiveTimestamp: '1683096659281',
      },
      messageAttributes: {},
      md5OfBody: '9aceb4682a96f19c17ac8cde7ce89cf4',
      eventSource: 'aws:sqs',
      eventSourceARN: 'arn:aws:sqs:us-east-1:690275943084:ProductsSQSQueue',
      awsRegion: 'us-east-1',
    },
  ],
}

describe('catalogBatchProcess', () => {
  beforeEach(() => {
    productsContainer.snapshot()
    productsContainer.unbind(NotificationRepository)
    productsContainer.unbind(ProductsRepository)
    productsContainer.bind(NotificationRepository).to(NotificationMockRepository).inSingletonScope()
    productsContainer.bind(ProductsRepository).to(ProductsMockRepository).inSingletonScope()
  })

  afterEach(() => {
    productsContainer.restore()
  })
  it('should finished with no error', async () => {
    await catalogBatchProcess(sqsEventMock)
  })
  it('should call 2 times create method from product repository', async () => {
    const productsRepoMock = productsContainer.get(ProductsRepository)
    jest.spyOn(productsRepoMock, 'create')
    await catalogBatchProcess(sqsEventMock)
    expect(productsRepoMock.create).toHaveBeenCalledTimes(2)
  })

  it('should send 2 notification massages', async () => {
    const notificationRepoMock = productsContainer.get(NotificationRepository)
    jest.spyOn(notificationRepoMock, 'sendNotification')
    await catalogBatchProcess(sqsEventMock)
    expect(notificationRepoMock.sendNotification).toHaveBeenCalled()
  })
})
