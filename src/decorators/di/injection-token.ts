import { IInjectionToken } from '../../models/decorators/di/injection-token'

export class InjectionToken<T> implements IInjectionToken<T> {

  public static create<T>(): InjectionToken<T> {
    return new InjectionToken()
  }

  private constructor() {}

}
