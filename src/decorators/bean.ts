import { makeConstructorDecorator } from '../core'
import { stub } from '../models/core/stub'

export const Bean = makeConstructorDecorator({handler: stub})
