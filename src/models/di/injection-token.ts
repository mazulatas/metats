import { Factory } from './factory'

export interface IInjectionToken<T> {
  name: string | symbol
  provider?: Factory<T>
}
