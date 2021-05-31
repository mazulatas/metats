import { ICtor, IResolver } from '../models'
import { IResolverContext } from '../models/core/resolver-context'

export class Resolver implements IResolver {

  private context: IResolverContext[] = []

  public add(params: IResolverContext[]): void {
    this.context = [ ...params, ...this.context ]
  }

  public resolveDecorationTime(target: ICtor) {
    this.resolve(target, this.getContextByCallMoment('decorate'))
  }

  public resolveBeforeCreateInstance(target: ICtor) {
    this.resolve(target, this.getContextByCallMoment('beforeCreateInstance'))
  }

  public resolveAfterCreateInstance(target: object) {
    this.resolve(target, this.getContextByCallMoment('afterCreateInstance'))
  }

  public hasName(name: string): boolean {
    return this.context.some(ctx => ctx.name === name)
  }

  public isResolve(name: string): boolean {
    return this.context.find(ctx => ctx.name === name)?.resolve || false
  }

  private getContextByCallMoment(runtime: 'decorate' | 'beforeCreateInstance' | 'afterCreateInstance'): IResolverContext[] {
    return this.context.filter(ctx => ctx.moment === runtime && !ctx.resolve)
  }

  private resolve(target: object, resolveTarget: IResolverContext[]) {
    resolveTarget.forEach(ctx => {
      try {
        ctx.handler(target, ...ctx.props)
        ctx.resolve = true
      } catch (e) {
        console.error(e)
      }
    })
  }
}
