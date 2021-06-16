import { getOriginalCtor, makeConstructorDecorator } from '../core'
import { IServiceOptions } from '../models/di/service-options'
import { Injector } from './injector'

export const Service = makeConstructorDecorator<IServiceOptions>({ handler, name: 'Service', prohibitDuplicates: true, moment: 'decorate' })

function handler(ctx: any, props: IServiceOptions) {
  const providers: any[] = props.providers?.map(p => getOriginalCtor(p)) || []
  const injector = Injector.create([ ctx, ...providers ])
  Injector.setInjector(ctx, injector)
  providers.forEach(p => {
    const provider = 'token' in p ? p.token : p
    Injector.setInjector(provider, injector)
  })
}
