import type { AWS } from '@serverless/typescript'

import { basicAuthorizer } from '@handlers'

const serverlessConfiguration: AWS = {
  service: 'authorization-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-dotenv-plugin', 'serverless-offline'],
  provider: {
    name: 'aws',
    region: 'us-east-1',
    profile: 'sandx',
    stage: 'dev',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import the function via paths
  functions: { basicAuthorizer },
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
  },
  resources: {
    Outputs: {
      BasicAuthorizerFunctionArn: {
        Value: { 'Fn::GetAtt': ['BasicAuthorizerLambdaFunction', 'Arn'] },
        Export: {
          Name: { 'Fn::Sub': '${AWS::StackName}-BasicAuthorizerArn' },
        },
      },
    },
  },
}

module.exports = serverlessConfiguration
