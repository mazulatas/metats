import { stub } from '../../models/core/stub'
import { IInjectionToken } from '../../models/decorators/di/injection-token'
import { Factory } from '../../models/decorators/di/token'

export class InjectionToken<T> implements IInjectionToken<T> {

  public static create<T>(name: string | symbol, provider?: Factory<T>): IInjectionToken<T> {
    return new InjectionToken(name, provider)
  }

  public static null(): IInjectionToken<null> {
    return new InjectionToken()
  }

  private constructor(private desc?: string | symbol, public provider: Factory<T> = stub) {}

  public get name() {
    return this.desc
  }

  public toString() {
    return this.name
  }
  
}
