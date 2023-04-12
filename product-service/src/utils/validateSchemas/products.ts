import { object, string, number } from 'yup'

export const createProductValidateSchema = object({
  title: string().required(),
  description: string().required().default(''),
  price: number().min(1).required(),
  count: number().min(1).required(),
})
