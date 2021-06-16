import { IFDeps, IFIsAny, IFToken } from './base'

export interface IRecord extends IFToken<any>, Required<IFDeps>, Required<IFIsAny> {
  fn: (...args: any[]) => any
  instance?: any
}
