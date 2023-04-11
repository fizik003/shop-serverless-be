import type { AWS } from '@serverless/typescript'

import { getProductsList, getProductById, createProduct } from 'src/handlers'

const serverlessConfiguration: AWS = {
  service: 'product-service',
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
        Action: ['dynamodb:Query', 'dynamodb:Scan', 'dynamodb:GetItem', 'dynamodb:PutItem'],
        Resource: [
          'arn:aws:dynamodb:us-east-1:690275943084:table/stock',
          'arn:aws:dynamodb:us-east-1:690275943084:table/products',
        ],
      },
    ],
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PRODUCTS_TABLE_NAME: '${self:custom.productsTableName}',
      REGION: '${self:provider.region}',
      PRODUCTS_TABLE: '${self:custom.productsTableName}',
      STOCK_TABLE: '${self:custom.stockTableName}',
    },
  },
  // import the function via paths
  functions: { getProductsList, getProductById, createProduct },
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
    productsTableName: 'products',
    stockTableName: 'stock',
  },
  // resources: {
  //   Resources: {
  //     productsTable: {
  //       Type: 'AWS::DynamoDB::Table',
  //       Properties: {
  //         TableName: '${self:custom.productsTableName}',
  //         AttributeDefinitions: [
  //           {
  //             AttributeName: 'id',
  //             AttributeType: 'S',
  //           },
  //         ],
  //         KeySchema: [
  //           {
  //             AttributeName: 'id',
  //             KeyType: 'HASH',
  //           },
  //         ],
  //         ProvisionedThroughput: {
  //           ReadCapacityUnits: 1,
  //           WriteCapacityUnits: 1,
  //         },
  //       },
  //     },
  //   },
  // },
}

module.exports = serverlessConfiguration
