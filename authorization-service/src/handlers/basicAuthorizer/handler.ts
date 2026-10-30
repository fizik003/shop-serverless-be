import { Handler } from 'aws-lambda'
import 'reflect-metadata'

import { BasicAuthorizationService } from '@services'
import { buildPolicy } from '@utils'
import { authorizationContainer } from '@containers'

import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerEvent,
} from 'aws-lambda/trigger/api-gateway-authorizer'
import { log } from 'console'

const basicAuthorizer: Handler<APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult> = async (
  event
) => {
  console.log('Lambda invocation with event: ', event)

  const authorizationService = authorizationContainer.get(BasicAuthorizationService)
  const { authorizationToken = '', methodArn, type } = event
  console.log('type', type)
  console.log('token', authorizationToken)

  if (type !== 'TOKEN' || !authorizationToken) {
    throw 'Unauthorized'
  }

  if (authorizationService.checkToken(authorizationToken)) {
    return buildPolicy(authorizationToken, methodArn, 'Allow')
  }

  return buildPolicy(authorizationToken, methodArn, 'Deny')
}

export const main = basicAuthorizer
