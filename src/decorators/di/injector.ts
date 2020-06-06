import { ProvidedIn } from '../../models/decorators/di/provided-in'
import { Token } from '../../models/decorators/di/token'
import { InjectionToken } from './injection-token'

export class Injector {

  public static get<T>(token: Token<T>): T {
    return Injector.instance.get(token)
  }

  public static set<T>(token: Token<T>, providedIn: ProvidedIn = 'any'): void {
    return Injector.instance.set(token, providedIn)
  }

  private static innerInstance: Injector

  private static get instance(): Injector {
    if (!Injector.innerInstance) Injector.innerInstance = new Injector()
    return Injector.innerInstance
  }

  private readonly injectStorage: WeakMap<Token<any>, InjectableCell<any>> = new WeakMap()

  private constructor() {}

  private set<T>(token: Token<T>, providedIn: ProvidedIn): void {
    if (this.injectStorage.has(token)) throw new Error(`token ${token} is created`)
    const cell = new InjectableCell(token, providedIn)
    this.injectStorage.set(token, cell)
  }

  private get<T>(token: Token<T>): T {
    if (!this.injectStorage.has(token)) throw new Error(`token ${token} not found`)
    const cell: InjectableCell<T> = this.injectStorage.get(token) as InjectableCell<T>
    return cell.getInstance()
  }

}

export class InjectableCell<T> {
  private instance?: T
  constructor(private token: Token<T>, private providedIn: ProvidedIn) {}

  public getInstance(): T {
    if (this.providedIn === 'any') return this.createNewInstance()
    if (!this.instance) this.instance = this.createNewInstance()
    return this.instance
  }

  private createNewInstance(): T {
    if (this.token instanceof InjectionToken) return {} as T
    const ctor = this.token as any
    const instance = new ctor()
    if (instance) return instance
    return ctor()
  }
}
