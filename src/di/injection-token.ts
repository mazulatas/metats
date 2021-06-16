import { IInjectionToken } from '../models'

export class InjectionToken implements IInjectionToken {

  public static create(name: string): IInjectionToken {
    return new InjectionToken(name)
  }

  protected constructor(public readonly name: string) {
  }
}
