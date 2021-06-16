import { checkDecorated, getFakeCtor } from '../core'
import { Provider } from '../models'
import { IRecord } from '../models/di/record'

export function createRecords(providers: Provider<any>[]): IRecord[] {
  const records: IRecord[] = []
  for (let i = 0; i < providers.length; i++) {
    const provider = providers[i]
    let token
    let deps: any[] = []
    let fn: ((...args: any[]) => any) | null = null
    let isAny = false

    if (typeof provider === 'function') {
      token = provider
      fn = (...args) => createInstance(provider, args)
    }

    if ('deps' in provider) deps = provider.deps || []
    if ('isAny' in provider) isAny = provider.isAny ?? false
    if ('token' in provider) token = provider.token
    if ('useValue' in provider) fn = () => provider.useValue
    if ('useFactory' in provider) fn = provider.useFactory
    if ('useClass' in provider) fn = (args) => createInstance(provider.useClass, args)
    if (!token) throw new Error('invalid token in provider')
    if (!fn) throw new Error('invalid value in provider, use useValue, useFactory, or useClass parameters')
    records.push({ token, deps, fn, isAny })
  }

  return records
}

function createInstance(type: any, deps: any[] = []) {
  let instance: any
  const faceCtor = checkDecorated(type) ? getFakeCtor(type) : type
  try {
    instance = new faceCtor(...deps)
  } catch (_) {
    instance = faceCtor(...deps)
  }
  return instance
}

export function injectError(msg: string, err?: Error) {
  return new Error(`Inject error: ${msg}${err ? ', ' + err : ''}`)
}
