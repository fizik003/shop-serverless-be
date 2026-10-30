import type { AWS } from '@serverless/typescript'

import { importProductsFile, importFileParser } from 'src/handlers'

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    region: 'us-east-1',
    runtime: 'nodejs14.x',
    profile: 'sandx',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: [
          'arn:aws:s3:::${self:custom.uploadBucket}',
          'arn:aws:s3:::${self:custom.uploadBucket}/*',
        ],
      },
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: {
          'Fn::ImportValue': 'product-service-dev-productsSQSArn',
        },
      },
    ],
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      REGION: '${self:provider.region}',
      UPLOAD_FOLDER: '${self:custom.uploadFolder}',
      UPLOAD_BUCKET: '${self:custom.uploadBucket}',
      PARSED_FOLDER: '${self:custom.parsedFolder}',
      SQS_URL: {
        'Fn::ImportValue': 'product-service-dev-productsSQSUrl',
      },
    },
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    uploadFolder: 'uploaded',
    uploadBucket: 'import-service003',
    parsedFolder: 'parsed',
  },
  resources: {
    Resources: {
      GatewayResponseDefault4XX: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
          },
          ResponseType: 'DEFAULT_4XX',
          RestApiId: { Ref: 'ApiGatewayRestApi' },
        },
      },
    },
  },
}

module.exports = serverlessConfiguration
