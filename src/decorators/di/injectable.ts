import { makeConstructorDecorator } from '../../core/core'
import { IType } from '../../models/core/type'
import { IInjectableParameters } from '../../models/decorators/di/injectable-parameters'
import { Injector } from './injector'

export const Injectable = makeConstructorDecorator<IInjectableParameters>({ handler: injectableHandler, moment: 'decorate' })

function injectableHandler(ctor: IType<any>): void {
  Injector.set(ctor)
}
