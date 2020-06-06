import { makeConstructorDecorator } from '../core/core'
import { stub } from '../models/core/stub'

export const Bean = makeConstructorDecorator({handler: stub})
