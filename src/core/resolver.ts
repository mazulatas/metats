import { ICtor } from '../models/ctor'
import { IResolver } from '../models/resolver'
import { IResolverContext } from '../models/resolver-context'

export class Resolver implements IResolver {

  private context: IResolverContext[] = []

  public add(params: IResolverContext[]): void {
    this.context.push(...params)
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
    const resolveTarget = this.context.filter(ctx => ctx.moment === runtime && !ctx.resolve)
    // .sort(Resolver.sort)
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
