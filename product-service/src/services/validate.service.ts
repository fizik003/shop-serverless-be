import { injectable } from 'inversify'
import { ObjectSchema } from 'yup'
import { ProductCreateData } from '@types'

@injectable()
export class ValidateService {
  async validate<S extends ObjectSchema<ProductCreateData>, T>(schema: S, data: T) {
    return schema.validate(data)
  }
}
