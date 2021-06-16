import { makeConstructorDecorator } from '../core'
import { IInjectableOptions } from '../models/di/injectable-options'

export const Injectable = makeConstructorDecorator<IInjectableOptions | void>({ handler, name: 'Injectable', moment: 'decorate' })

function handler(ctx: any, props: IInjectableOptions | void) {

}
