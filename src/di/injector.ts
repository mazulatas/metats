import { getOriginalCtor } from '../core'
import { INJECTOR, Provider, Token } from '../models'
import { IRecord } from '../models/di/record'
import { createRecords, injectError } from './utils'

function buildInjector(providers?: Provider<any>[], source?: string) {
  return new StaticInjector(providers, source || 'root')
}

export abstract class Injector {
  public static get root(): Injector {
    if (!Injector.innerRoot) Injector.innerRoot = Injector.create()
    return Injector.innerRoot
  }

  public static create(providers?: Provider<any>[], source?: string): Injector {
    const injector = buildInjector(providers, source)
    injector.parent = Injector.innerRoot
    return injector
  }

  public static getInjector(ctx: any): Injector | undefined {
    const originalCtor = getOriginalCtor(ctx)
    return Reflect.get(originalCtor, INJECTOR)
  }

  public static setInjector(ctx: any, injector: Injector): void {
    const originalCtor = getOriginalCtor(ctx)
    Reflect.set(originalCtor, INJECTOR, injector)
  }

  public static getOrCreateInjector(ctx: any, providers?: Provider<any>[]): Injector {
    let injector = Injector.getInjector(ctx)
    if (!injector) injector = Injector.create(providers, ctx.name)
    return injector
  }

  public static getRootInjector(injector: Injector): Injector {
    if (!injector.parent) return injector
    return Injector.getRootInjector(injector.parent)
  }

  public static bindParentInjector(targets: any | any[], injector: Injector) {
    const innerTargets = Array.isArray(targets) ? targets : [ targets ]
    for (let i = 0; i < innerTargets.length; i++) {
      const target = innerTargets[i]
      const targetInjector = Injector.getInjector(target)
      if (!targetInjector) throw new Error(`${target.name} is not a injectable`)
      targetInjector.parent = injector
    }
  }

  private static innerRoot: Injector | null = null

  public abstract parent: Injector | null
  protected constructor() {}
  public abstract get<T>(token: Token<T>, notFoundValue?: T): T
  public abstract set(providers: Provider<any>[]): void

}

export class StaticInjector extends Injector {

  public parent: Injector | null = null
  private readonly records: Map<Token<any>, IRecord> = new Map()

  constructor(providers?: Provider<any>[], public readonly source?: string) {
    super()
    this.records.set(Injector, { token: Injector as any, fn: () => this, deps: [], isAny: false })
    if (providers) this.set(providers)
  }

  public set(providers: Provider<any>[]) {
    const records = createRecords(providers)
    for (let i = 0; i < records.length; i++) {
      const record = records[i]
      this.records.set(record.token, record)
    }
  }

  public get<T>(token: Token<T>, notFoundValue?: T): T {
    const innerToken = getOriginalCtor(token)
    for (const entry of this.records) {
      const record = entry[1]
      if (record.token === innerToken) {
        if (record.instance) return record.instance as T
        const deps = []
        for (let j = 0; j < record.deps.length; j++) {
          const dep: any = record.deps[j]
          deps.push(this.get(dep))
        }
        let instance
        try {
          instance = record.fn(...deps)
        } catch (err) {
          throw injectError('error create instance', err)
        }
        if (!record.isAny) record.instance = instance
        return instance as T
      }
    }
    if (this.parent) return this.parent.get(innerToken, notFoundValue)
    if (notFoundValue) return notFoundValue
    throw injectError(`token ${token.name} not exist`)
  }

}
