import { PublishCommandInput } from '@aws-sdk/client-sns'

export type Notification = Pick<PublishCommandInput, 'Message' | 'Subject' | 'MessageAttributes'>
