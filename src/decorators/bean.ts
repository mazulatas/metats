import { makeConstructorDecorator } from '../core'
import { stub } from '../models'

export const Bean = makeConstructorDecorator({handler: stub})
