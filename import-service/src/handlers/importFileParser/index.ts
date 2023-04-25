import { handlerPath } from '@libs/handler-resolver'

// const BUCKET_NAME = process.env.UPLOAD_BUCKET

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: 'import-service003',
        event: 's3:ObjectCreated:*',
        rules: [{ prefix: 'uploaded/' }, { suffix: '.csv' }],
        existing: true,
      },
    },
  ],
}
