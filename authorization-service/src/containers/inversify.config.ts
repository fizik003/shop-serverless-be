import 'reflect-metadata'
import { Container } from 'inversify'

import { BasicAuthorizationService } from '@services'

export const authorizationContainer = new Container()

authorizationContainer
  .bind<BasicAuthorizationService>(BasicAuthorizationService)
  .to(BasicAuthorizationService)
