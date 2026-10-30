import { injectable } from 'inversify'

@injectable()
export class BasicAuthorizationService {
  checkToken(token: string): boolean {
    const [login, password] = this.getUserDataFromToken(token)
    const allowedPassword = process.env[login]
    return login && password && allowedPassword === password
  }

  getUserDataFromToken(token: string) {
    const tokenBase64 = token.split(' ')[1]
    const userData = Buffer.from(tokenBase64, 'base64').toString('utf-8')
    return userData.split(':')
  }
}
