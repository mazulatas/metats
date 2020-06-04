import { ContextType } from '../models/context-type'
import { ICtor } from '../models/ctor'
import { IHandlerCallMoment } from '../models/handler-call-moment'
import { IBaseHandler } from '../models/handlers'
import { IParamsDecoratorMaker } from '../models/params-decorator-maker'
import { IResolverContext } from '../models/resolver-context'
import { stub } from '../models/stub'

/**
 * Resolving order
 * ⇓ decorate - before - ctor
 * ⇓ decorate - after - ctor
 * ⇓ decorate - before - method
 * ⇓ decorate - after - method
 * ⇓ decorate - before - field
 * ⇓ decorate - after - field
 * ⇓ decorate - before - param
 * ⇓ decorate - after - param
 * ⇓ beforeCreateInstance - before - ctor
 * ⇓ beforeCreateInstance - after - ctor
 * ⇓ beforeCreateInstance - before - method
 * ⇓ beforeCreateInstance - after - method
 * ⇓ beforeCreateInstance - before - field
 * ⇓ beforeCreateInstance - after - field
 * ⇓ beforeCreateInstance - before - param
 * ⇓ beforeCreateInstance - after - param
 * ⇓ afterCreateInstance - before - ctor
 * ⇓ afterCreateInstance - after - ctor
 * ⇓ afterCreateInstance - before - method
 * ⇓ afterCreateInstance - after - method
 * ⇓ afterCreateInstance - before - field
 * ⇓ afterCreateInstance - after - field
 * ⇓ afterCreateInstance - before - param
 * ⇓ afterCreateInstance - after - param
 */

const defaultHandlerCallMoment: IHandlerCallMoment = {
  runtime: 'decorate',
  when: 'before',
  then: 'ctor'
}

export class Resolver {
  
  private static sort(ctx1: IResolverContext, ctx2: IResolverContext): number {
    const { runtime: runtime1 } = ctx1.moment
    const { runtime: runtime2 } = ctx2.moment
    if (runtime1 === 'decorate' && runtime2 !== 'decorate') return 1
    if (runtime1 !== 'decorate' && runtime2 === 'decorate') return -1
    if (runtime1 === 'beforeCreateInstance' && runtime2 !== 'afterCreateInstance') return 1
    if (runtime1 === 'afterCreateInstance' && runtime2 !== 'beforeCreateInstance') return -1
    if (runtime1 === runtime2) return Resolver.sortWhen(ctx1, ctx2)
    return 0
  }

  private static sortWhen(ctx1: IResolverContext, ctx2: IResolverContext): number {
    const { when: when1 } = ctx1.moment
    const { when: when2 } = ctx2.moment
    if (when1 === 'before' && when2 === 'after') return 1
    if (when1 === 'after' && when2 === 'before') return -1
    if (when1 === when2) return Resolver.sortThen(ctx1, ctx2)
    return 0
  }
  
  private static sortThen(ctx1: IResolverContext, ctx2: IResolverContext): number {
    const { then: then1 } = ctx1.moment
    const { then: then2 } = ctx2.moment
    if (then1 === 'ctor' && then2 !== 'ctor') return 1
    if (then1 !== 'ctor' && then2 === 'ctor') return -1
    if (then1 === 'method' && then2 === 'field') return 1
    if (then1 === 'field' && then2 === 'method') return -1
    if (then1 === 'param' && then2 !== 'param') return -1
    if (then1 !== 'param' && then2 === 'param') return 1
    if (then1 === then2) return Resolver.sortName(ctx1, ctx2)
    return 0
  }

  private static sortName(ctx1: IResolverContext, ctx2: IResolverContext): number {
    return 0
  }

  private context: IResolverContext[] = []
  private ts = Date.now()

  public add<H extends IBaseHandler<P>, P>(params: IParamsDecoratorMaker<H, P>[], type: ContextType): void {
    params.forEach(param => {
      const moment = param.moment || {}
      this.context.push({
        type,
        handler: param.handler,
        props: (param.propsMutator || stub) as any,
        moment: {...defaultHandlerCallMoment, ...moment},
        name: param.name,
        resolve: false
      })
    })
  }

  public resolveDecorationTime(target: ICtor) {
    this.resolve(target, 'decorate')
  }

  public resolveBeforeCreateInstance(target: ICtor) {
    this.resolve(target, 'beforeCreateInstance')
  }

  public resolveAfterCreateInstance(target: object) {
    this.resolve(target, 'afterCreateInstance')
  }

  public hasName(name: string): boolean {
    return !!this.context.find(ctx => ctx.name === name)
  }

  public isResolve(name: string): boolean {
    return this.context.find(ctx => ctx.name === name)?.resolve || false
  }

  private resolve(target: object, runtime: 'decorate' | 'beforeCreateInstance' | 'afterCreateInstance') {
    const resolveTarget = this.context.filter(ctx => ctx.moment.runtime === runtime && !ctx.resolve)
    // .sort(Resolver.sort)
    resolveTarget.forEach(ctx => {
      try {
        ctx.handler(target, ctx.props())
        ctx.resolve = true
      } catch (e) {
        console.error(e)
      }
    })
  }
}
