import { makeConstructorDecorator } from '../core/core'
import { stub } from '../models'

export const Bean = makeConstructorDecorator({handler: stub})
