import { makeConstructorDecorator } from '../core/core'
import { MomentCall, stub } from '../models'

export const Bean = makeConstructorDecorator(MomentCall.decorate, stub)
