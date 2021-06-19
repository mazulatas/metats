import { IArgumentsWrapper } from './arguments-wrapper'
import { IResolverContext } from './resolver-context'

export interface IResolver {
  add(params: IResolverContext[]): void
  hasName(name: string): boolean
  isResolve(name: string): boolean
  resolveDecorationTime(target: object): void
  resolveBeforeCreateInstance(target: object, args: IArgumentsWrapper): void
  resolveAfterCreateInstance(target: object, args: IArgumentsWrapper): void
}
