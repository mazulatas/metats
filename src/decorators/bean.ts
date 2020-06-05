import { makeConstructorDecorator } from '../core/core'
import { stub } from '../models/stub'

export const Bean = makeConstructorDecorator({handler: stub})
