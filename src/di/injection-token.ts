import { IInjectionToken } from '../models'

export class InjectionToken<T> implements IInjectionToken<T> {

  public static create<T>(name: string): IInjectionToken<T> {
    return new InjectionToken(name)
  }

  protected constructor(public readonly name: string) {
  }
}
